(function () {
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("search");
  const filtersEl = document.getElementById("filters");

  const notes = [...NOTES].sort((a, b) => (a.date < b.date ? 1 : -1));

  const categories = ["Все", ...new Set(notes.map((n) => n.category))];
  let activeCategory = "Все";
  let query = "";

  function renderFilters() {
    filtersEl.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-pill" + (cat === activeCategory ? " active" : "");
      btn.type = "button";
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderFilters();
        renderGrid();
      });
      filtersEl.appendChild(btn);
    });
  }

  function matchesQuery(note, q) {
    if (!q) return true;
    const haystack = [note.title, note.description, note.category, ...note.tags]
      .join(" ")
      .toLocaleLowerCase("ru");
    return haystack.includes(q);
  }

  function renderGrid() {
    const q = query.trim().toLocaleLowerCase("ru");
    const filtered = notes.filter((n) => {
      const categoryOk = activeCategory === "Все" || n.category === activeCategory;
      return categoryOk && matchesQuery(n, q);
    });

    grid.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Ничего не найдено";
      grid.appendChild(empty);
      return;
    }

    filtered.forEach((note) => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = note.file;

      if (note.example) {
        const badge = document.createElement("span");
        badge.className = "card-badge";
        badge.textContent = "ПРИМЕР";
        card.appendChild(badge);
      }

      const meta = document.createElement("div");
      meta.className = "card-meta";

      const category = document.createElement("span");
      category.className = "card-category";
      category.textContent = note.category;

      const date = document.createElement("span");
      date.className = "card-date";
      date.textContent = note.displayDate;

      meta.appendChild(category);
      meta.appendChild(date);

      const title = document.createElement("h2");
      title.textContent = note.title;

      const desc = document.createElement("p");
      desc.textContent = note.description;

      const tags = document.createElement("div");
      tags.className = "card-tags";
      note.tags.forEach((t) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = t;
        tags.appendChild(tag);
      });

      card.appendChild(meta);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(tags);

      grid.appendChild(card);
    });
  }

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderGrid();
  });

  renderFilters();
  renderGrid();
})();
