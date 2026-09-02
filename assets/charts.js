// Простой SVG line-chart рендерер для конспектов.
// Использование: renderChart('svg-id', { series, annotations, zeroLine, xFormat, yFormat })
(function () {
  var VB_W = 640, VB_H = 260;
  var M = { l: 44, r: 12, t: 10, b: 22 };
  var plotW = VB_W - M.l - M.r, plotH = VB_H - M.t - M.b;
  var svgns = "http://www.w3.org/2000/svg";

  function el(tag, attrs) {
    var n = document.createElementNS(svgns, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function renderChart(svgId, cfg) {
    var svg = document.getElementById(svgId);
    if (!svg) return;

    var allX = [], allY = [];
    cfg.series.forEach(function (s) { s.data.forEach(function (p) { allX.push(p[0]); allY.push(p[1]); }); });
    (cfg.annotations || []).forEach(function (a) { allY.push(a.y); });
    var xMin = Math.min.apply(null, allX), xMax = Math.max.apply(null, allX);
    var yMin = Math.min.apply(null, allY), yMax = Math.max.apply(null, allY);
    var pad = (yMax - yMin) * 0.14 || Math.abs(yMax) * 0.1 || 1;
    var yTop = yMax + pad;
    var yBot = cfg.zeroLine ? Math.min(0, yMin - pad) : yMin - pad;

    function sx(x) { return M.l + (x - xMin) / (xMax - xMin) * plotW; }
    function sy(y) { return M.t + plotH - (y - yBot) / (yTop - yBot) * plotH; }

    var yTicks = 4;
    for (var i = 0; i <= yTicks; i++) {
      var v = yBot + (yTop - yBot) * i / yTicks;
      var yy = sy(v);
      svg.appendChild(el("line", { x1: M.l, x2: VB_W - M.r, y1: yy, y2: yy, class: "grid-line" }));
      var t = el("text", { x: 4, y: yy + 3, class: "axis-label" });
      t.textContent = cfg.yFormat ? cfg.yFormat(v) : Math.round(v);
      svg.appendChild(t);
    }
    if (cfg.zeroLine && yBot < 0 && yTop > 0) {
      var y0 = sy(0);
      svg.appendChild(el("line", { x1: M.l, x2: VB_W - M.r, y1: y0, y2: y0, class: "zero-line" }));
    }

    var xs = cfg.series[0].data.map(function (p) { return p[0]; });
    var tickCount = Math.min(5, xs.length);
    var xTickVals = [];
    for (var j = 0; j < tickCount; j++) {
      var idx = Math.round(j * (xs.length - 1) / (tickCount - 1 || 1));
      xTickVals.push(xs[idx]);
    }
    xTickVals.forEach(function (xv) {
      var xx = sx(xv);
      var t = el("text", { x: xx, y: VB_H - 4, class: "axis-label", "text-anchor": "middle" });
      t.textContent = cfg.xFormat ? cfg.xFormat(xv) : Math.round(xv);
      svg.appendChild(t);
    });

    cfg.series.forEach(function (s) {
      var d = s.data.map(function (p, i) { return (i === 0 ? "M" : "L") + sx(p[0]).toFixed(1) + "," + sy(p[1]).toFixed(1); }).join(" ");
      svg.appendChild(el("path", { d: d, class: "series-line", stroke: s.color }));
      var last = s.data[s.data.length - 1];
      svg.appendChild(el("circle", { cx: sx(last[0]), cy: sy(last[1]), r: 3.5, class: "end-dot", fill: s.color }));
    });

    (cfg.annotations || []).forEach(function (a) {
      var cx = sx(a.x), cy = sy(a.y);
      svg.appendChild(el("circle", { cx: cx, cy: cy, r: 2.6, class: "annotation-dot", fill: cfg.series[0].color }));
      var lab = el("text", { x: cx, y: cy - 8, class: "annotation-label", "text-anchor": a.anchor || "middle" });
      lab.textContent = a.label;
      svg.appendChild(lab);
    });

    var hoverLine = el("line", { x1: 0, x2: 0, y1: M.t, y2: VB_H - M.b, class: "hover-line" });
    svg.appendChild(hoverLine);
    var hoverDots = cfg.series.map(function (s) {
      var c = el("circle", { r: 4, class: "hover-dot", fill: s.color });
      svg.appendChild(c);
      return c;
    });

    var wrap = svg.closest(".chart-wrap");
    var tip = document.createElement("div");
    tip.className = "chart-tip";
    wrap.appendChild(tip);

    function nearestIndex(mx) {
      var best = 0, bestD = Infinity;
      xs.forEach(function (xv, i) { var d = Math.abs(sx(xv) - mx); if (d < bestD) { bestD = d; best = i; } });
      return best;
    }

    function onMove(clientX) {
      var rect = svg.getBoundingClientRect();
      var wrapRect = wrap.getBoundingClientRect();
      if (!rect.width) return;
      var scaleX = VB_W / rect.width, scaleY = VB_H / rect.height;
      var mx = (clientX - rect.left) * scaleX;
      var idx = nearestIndex(mx);
      var xv = xs[idx];
      var px = sx(xv);
      hoverLine.setAttribute("x1", px); hoverLine.setAttribute("x2", px);
      hoverLine.style.opacity = 1;
      var tipHtml = '<div class="tip-x">' + (cfg.xFormat ? cfg.xFormat(xv) : Math.round(xv)) + "</div>";
      var firstPy = null;
      cfg.series.forEach(function (s, si) {
        var pt = s.data[idx] || s.data[s.data.length - 1];
        var py = sy(pt[1]);
        if (firstPy === null) firstPy = py;
        hoverDots[si].setAttribute("cx", px);
        hoverDots[si].setAttribute("cy", py);
        hoverDots[si].style.opacity = 1;
        tipHtml += '<div class="tip-row"><span class="tip-sw" style="background:' + s.color + '"></span>' + (s.label ? s.label + ": " : "") + (cfg.yFormat ? cfg.yFormat(pt[1]) : pt[1]) + "</div>";
      });
      tip.innerHTML = tipHtml;
      tip.style.left = ((rect.left - wrapRect.left) + px / scaleX) + "px";
      tip.style.top = ((rect.top - wrapRect.top) + firstPy / scaleY) + "px";
      tip.style.opacity = 1;
    }
    function onLeave() {
      hoverLine.style.opacity = 0;
      hoverDots.forEach(function (d) { d.style.opacity = 0; });
      tip.style.opacity = 0;
    }
    svg.addEventListener("mousemove", function (e) { onMove(e.clientX); });
    svg.addEventListener("mouseleave", onLeave);
    svg.addEventListener("touchmove", function (e) { if (e.touches[0]) onMove(e.touches[0].clientX); }, { passive: true });
    svg.addEventListener("touchend", onLeave);
  }

  window.renderChart = renderChart;
})();
