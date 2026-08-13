const initialBooks = [];

const storageKey = "bookly-library-real";
const savedBooks = (() => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "null");
  } catch {
    return null;
  }
})();

const state = {
  books: savedBooks || initialBooks,
  query: ""
};

const elements = {
  search: document.querySelector("#searchInput"),
  libraryCount: document.querySelector("#libraryCount"),
  featured: document.querySelector("#featuredSection"),
  wantGrid: document.querySelector("#wantGrid"),
  doneGrid: document.querySelector("#doneGrid"),
  stats: document.querySelector("#stats"),
  modal: document.querySelector("#bookModal"),
  form: document.querySelector("#bookForm"),
  openModal: document.querySelector("#openModal"),
  closeModal: document.querySelector("#closeModal"),
  cancelBook: document.querySelector("#cancelBook"),
  themeToggle: document.querySelector("#themeToggle")
};

function save() {
  localStorage.setItem(storageKey, JSON.stringify(state.books));
}

function progress(book) {
  if (book.status === "done") return 100;
  return Math.min(100, Math.round((book.currentPage / book.pages) * 100));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function filteredBooks(status) {
  const query = state.query.trim().toLowerCase();
  return state.books
    .filter((book) => book.status === status)
    .filter((book) => {
      if (!query) return true;
      return `${book.title} ${book.author}`.toLowerCase().includes(query);
    });
}

function coverMarkup(book) {
  const shortTitle = book.title.length > 18 ? book.title.slice(0, 18) : book.title;
  return `
    <div class="cover ${book.cover}">
      <span class="cover-title">${escapeHtml(shortTitle)}</span>
      <span class="cover-author">${escapeHtml(book.author)}</span>
    </div>
  `;
}

function stars(rating) {
  if (!rating) return "";
  return `<div class="stars" aria-label="${rating} de 5 estrelas">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</div>`;
}

function renderFeatured() {
  const reading = filteredBooks("reading")[0];

  if (!reading) {
    elements.featured.innerHTML = `
      <div class="section-heading reading-heading"><h2>Lendo agora</h2></div>
      <article class="reading-card empty-reading">
        <div class="empty-cover" aria-hidden="true">
          <span></span>
          <span></span>
        </div>
        <div class="reading-copy">
          <h2>Nenhuma leitura ativa</h2>
          <p class="author">Cadastre um livro real e marque como lendo.</p>
          <div class="page-line">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /></svg>
            Página 0 de 0
          </div>
          <div class="progress-row">
            <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width: 0%"></div></div>
            <span>0%</span>
          </div>
          <button class="outline-button" type="button" id="emptyAddBook">Cadastrar livro</button>
        </div>
        <div class="reading-art" aria-hidden="true"></div>
      </article>
    `;
    return;
  }

  const pct = progress(reading);
  elements.featured.innerHTML = `
    <div class="section-heading reading-heading"><h2>Lendo agora</h2></div>
    <article class="reading-card">
      ${coverMarkup(reading)}
      <div class="reading-copy">
        <h2>${escapeHtml(reading.title)}</h2>
        <p class="author">${escapeHtml(reading.author)}</p>
        <div class="page-line">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /></svg>
          Página ${reading.currentPage} de ${reading.pages}
        </div>
        <div class="progress-row">
          <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width: ${pct}%"></div></div>
          <span>${pct}%</span>
        </div>
        <button class="outline-button" data-progress="${reading.id}">Atualizar progresso</button>
      </div>
      <div class="reading-art" aria-hidden="true"></div>
    </article>
  `;
}

function renderGrid(container, books, status) {
  if (!books.length) {
    container.innerHTML = Array.from({ length: 4 }, (_, index) => `
      <article class="book-card empty-slot ${index === 0 ? "with-note" : ""}">
        <div class="book-cover"></div>
        ${index === 0 ? '<div class="meta"><h3>Nada por aqui ainda</h3><p>Use o botão + para cadastrar</p></div>' : ""}
      </article>
    `).join("");
    return;
  }

  container.innerHTML = books
    .slice(0, 4)
    .map((book) => `
      <article class="book-card ${book.cover}" data-id="${book.id}">
        <div class="book-cover"></div>
        ${status === "done" ? '<span class="checkmark">✓</span>' : '<span class="bookmark"></span>'}
        <div class="meta">
          <h3 title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</h3>
          <p title="${escapeHtml(book.author)}">${escapeHtml(book.author)}</p>
          ${stars(book.rating)}
        </div>
      </article>
    `)
    .join("");
}

function renderStats() {
  const total = state.books.length;
  const reading = state.books.filter((book) => book.status === "reading").length;
  const done = state.books.filter((book) => book.status === "done").length;
  const rated = state.books.filter((book) => book.rating > 0);
  const avg = rated.length
    ? (rated.reduce((sum, book) => sum + Number(book.rating), 0) / rated.length).toFixed(1).replace(".", ",")
    : "0";

  elements.stats.innerHTML = [
    stat("book", total, "Livros na biblioteca", "#6256b4"),
    stat("open", reading, "Lendo agora", "#d8764d"),
    stat("check", done, "Livros concluídos", "#4fa75d"),
    stat("star", avg, "Avaliação média", "#bd8b26")
  ].join("");
}

function stat(icon, value, label, color) {
  const icons = {
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h5v18H6.5A2.5 2.5 0 0 1 4 19.5Zm9-16h5a2 2 0 0 1 2 2v14.5a2.5 2.5 0 0 0-2.5-2.5H13V3.5Z" />',
    open: '<path d="M12 7v13M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm16 0A2.5 2.5 0 0 0 17.5 3H12v17h5.5A2.5 2.5 0 0 1 20 22V5.5Z" />',
    check: '<path d="M20 6 9 17l-5-5" />',
    star: '<path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6L12 16.77 6.6 19.6l1.03-6-4.36-4.25 6.03-.88L12 3Z" />'
  };

  return `
    <div class="stat">
      <span class="stat-icon" style="background:${color}33;color:${color}">
        <svg viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg>
      </span>
      <span><strong>${value}</strong><span>${label}</span></span>
    </div>
  `;
}

function render() {
  const count = state.books.length;
  elements.libraryCount.textContent = `${count} ${count === 1 ? "livro esperando" : "livros esperando"} por você.`;
  renderFeatured();
  renderGrid(elements.wantGrid, filteredBooks("want"), "want");
  renderGrid(elements.doneGrid, filteredBooks("done"), "done");
  renderStats();
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

elements.openModal.addEventListener("click", () => {
  elements.form.reset();
  elements.modal.showModal();
});

elements.closeModal.addEventListener("click", () => {
  elements.modal.close();
});

elements.cancelBook.addEventListener("click", () => {
  elements.modal.close();
});

elements.themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.form);
  const pages = Number(data.get("pages"));
  const status = data.get("status");
  const currentPage = status === "done" ? pages : Math.min(Number(data.get("currentPage")) || 0, pages);

  state.books.unshift({
    id: crypto.randomUUID(),
    title: data.get("title").trim(),
    author: data.get("author").trim(),
    pages,
    currentPage,
    status,
    rating: Number(data.get("rating")),
    cover: data.get("cover")
  });

  save();
  elements.modal.close();
  render();
});

document.addEventListener("click", (event) => {
  if (event.target.closest("#emptyAddBook")) {
    elements.form.reset();
    elements.modal.showModal();
    return;
  }

  const progressButton = event.target.closest("[data-progress]");
  if (!progressButton) return;

  const book = state.books.find((item) => item.id === progressButton.dataset.progress);
  const nextPage = Number(prompt(`Página atual de "${book.title}"`, book.currentPage));

  if (Number.isNaN(nextPage)) return;
  book.currentPage = Math.max(0, Math.min(nextPage, book.pages));
  if (book.currentPage >= book.pages) {
    book.status = "done";
    book.rating = book.rating || 5;
  }
  save();
  render();
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.search.focus();
  });
});

render();
