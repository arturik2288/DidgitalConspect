// Манифест конспектов. Чтобы добавить новый конспект:
// 1. Положите HTML-файл конспекта в папку notes/
// 2. Добавьте объект в массив NOTES ниже
//
// Поля:
//   id       — уникальный строковый идентификатор
//   title    — заголовок карточки
//   division — раздел сайта: "economics" | "math" | "it" (определяет, на какой странице раздела появится карточка)
//   category — предмет внутри раздела (используется для фильтра и цветной плашки)
//   date     — дата в формате YYYY-MM-DD (для сортировки), displayDate — как показывать
//   description — краткое описание (1-2 предложения)
//   tags     — массив тегов
//   file     — путь к HTML-файлу конспекта относительно страниц sections/*.html (обычно "../notes/...")
//   example  — true, если это демонстрационный конспект (покажется бейдж "ПРИМЕР")

const NOTES = [
  {
    id: "ml-linear-regression",
    title: "ML: линейная и логистическая регрессия",
    division: "it",
    category: "Машинное обучение",
    date: "2026-09-14",
    displayDate: "14 сен 2026",
    description: "Постановка задачи ML, линейная модель и признаки для неё, функции потерь регрессии (MSE, MAE, Huber, квантильная), переобучение и кросс-валидация, точное решение и градиентный спуск (SGD, SAG, Adam), логистическая регрессия и регуляризация.",
    tags: ["линейная регрессия", "градиентный спуск"],
    file: "../notes/ml-linear-regression.html",
    example: false
  },
  {
    id: "nlp-lecture1-embeddings-rnn",
    title: "NLP. Лекция 1: от Bag-of-Words до RNN и LSTM",
    division: "it",
    category: "NLP",
    date: "2026-09-13",
    displayDate: "13 сен 2026",
    description: "One-hot, BoW, TF-IDF и LSA; классификация текста (наивный Байес, TF-IDF+LogReg, Bag of Embeddings); Word2Vec, negative sampling и hierarchical softmax; FastText, GloVe; N-граммы, RNN, взрыв/затухание градиентов и LSTM.",
    tags: ["word2vec", "RNN"],
    file: "../notes/nlp-lecture1-embeddings-rnn.html",
    example: false
  },
  {
    id: "llm-inference-serving",
    title: "LLM Inference & Serving: KV-кэш, батчинг, квантизация",
    division: "it",
    category: "LLM-агенты",
    date: "2026-09-12",
    displayDate: "12 сен 2026",
    description: "Prefill и decode, зачем нужен KV-кэш и его цена, непрерывный батчинг и PagedAttention, constrained decoding, speculative decoding, квантизация (FP16/INT8/INT4, GPTQ/AWQ/GGUF) и выбор между vLLM и SGLang.",
    tags: ["kv-cache", "quantization"],
    file: "../notes/llm-inference-serving.html",
    example: false
  },
  {
    id: "llm-fundamentals",
    title: "LLM Fundamentals: токенизация, эмбеддинги, трансформер",
    division: "it",
    category: "LLM-агенты",
    date: "2026-09-11",
    displayDate: "11 сен 2026",
    description: "BPE-токенизация, эмбеддинги и косинусное сходство, механизм внимания и архитектура трансформера, почему галлюцинации структурны, параметры генерации (temperature, top-k/top-p/min-p) и что на самом деле покупает reasoning effort.",
    tags: ["transformer", "attention"],
    file: "../notes/llm-fundamentals.html",
    example: false
  },
  {
    id: "dl-lecture2-dropout-batchnorm",
    title: "Deep Learning. Лекция 2: NLL, Dropout и Batch Norm",
    division: "it",
    category: "Глубокое обучение",
    date: "2026-09-10",
    displayDate: "10 сен 2026",
    description: "Softmax и log-sum-exp трюк, NLL/Cross-Entropy, label smoothing и blending, dropout (train/eval, inverted dropout) и batch normalization (running-статистики, internal covariate shift).",
    tags: ["dropout", "batch normalization"],
    file: "../notes/dl-lecture2-dropout-batchnorm.html",
    example: false
  },
  {
    id: "dl-lecture1-mlp",
    title: "Deep Learning. Лекция 1: MLP и backpropagation",
    division: "it",
    category: "Глубокое обучение",
    date: "2026-09-09",
    displayDate: "9 сен 2026",
    description: "Чем DL отличается от классического ML, вычислительный граф и backpropagation по цепному правилу, слои сети, MLP и функции активации (sigmoid, ReLU, Leaky ReLU, tanh, softplus) в контексте затухающего градиента.",
    tags: ["backpropagation", "MLP"],
    file: "../notes/dl-lecture1-mlp.html",
    example: false
  },
  {
    id: "olg-model",
    title: "Модель перекрывающихся поколений (OLG)",
    division: "economics",
    category: "Макроэкономика",
    date: "2026-09-08",
    displayDate: "8 сен 2026",
    description: "Почему децентрализованное равновесие с конечно живущими домохозяйствами не обязано быть Парето-эффективным: критерий Касса, альтруизм и наследство, накопительные и распределительные пенсионные системы, судьба Рикардианской эквивалентности.",
    tags: ["OLG", "динамическая эффективность"],
    file: "../notes/olg-model.html",
    example: false
  },
  {
    id: "islm-bp",
    title: "Модель IS-LM-BP",
    division: "economics",
    category: "Макроэкономика",
    date: "2026-09-07",
    displayDate: "7 сен 2026",
    description: "Платёжный баланс, условие Маршалла-Лернера, мобильность капитала и наклон BP, фискальная и монетарная политика при фиксированном и плавающем курсе, трилемма невозможности.",
    tags: ["IS-LM-BP", "открытая экономика"],
    file: "../notes/islm-bp.html",
    example: false
  },
  {
    id: "econometrics-intro",
    title: "Эконометрика. Введение и линейная регрессия",
    division: "economics",
    category: "Эконометрика",
    date: "2026-09-04",
    displayDate: "4 сен 2026",
    description: "Предмет эконометрики, причинность против корреляции (ложная регрессия), методология исследования и линейная регрессия на примере связи роста и веса.",
    tags: ["линейная регрессия", "МНК"],
    file: "../notes/econometrics-intro.html",
    example: false
  },
  {
    id: "ramsey-model",
    title: "Модель Рамсея–Касса–Купманса",
    division: "economics",
    category: "Макроэкономика",
    date: "2026-09-02",
    displayDate: "2 сен 2026",
    description: "Откуда берётся норма сбережений, если её никто не назначает: планировщик, уравнение Эйлера, фазовая диаграмма, золотое правило и эквивалентность Барро-Рикардо.",
    tags: ["модель Рамсея", "оптимальный рост"],
    file: "../notes/ramsey-model.html",
    example: false
  },
  {
    id: "intertemporal-choice",
    title: "Межвременной выбор",
    division: "economics",
    category: "Макроэкономика",
    date: "2026-09-01",
    displayDate: "1 сен 2026",
    description: "Почему потребление сглажено, а инвестиции волатильны; уравнение Эйлера и модель перманентного дохода.",
    tags: ["уравнение Эйлера", "финансовые рынки"],
    file: "../notes/intertemporal-choice.html",
    example: false
  }
];
