// ui_dialog.js — Library and book reading panel.
// Handles the library shelf view and individual book reading screen.
// Note: toast() and msg() live in gameplay.js. showBossDropEffect() lives in gameplay.js.
// playerDeath/respawn screens are managed by combat.js.
// Depends on: state.js, data.js (LIBRARY_BOOKS), ui_hud.js (saveGame).

// ─── LIBRARY ──────────────────────────────────────────────────────────────────
function openLibrary() {
  document.getElementById('library-screen').style.display = 'flex';
  document.getElementById('library-shelves').style.display = '';
  document.getElementById('library-book-panel').style.display = 'none';
  let shelves = document.getElementById('library-shelves');
  shelves.innerHTML = '';
  for (let book of LIBRARY_BOOKS) {
    let isRead = game.flags['book_read_' + book.id];
    let div = document.createElement('div');
    div.className = 'library-book';
    div.style.borderColor = book.color;
    div.innerHTML = `
      <div class="library-book-spine" style="background:${book.color}"></div>
      <div class="library-book-info">
        <div class="library-book-title" style="color:${book.color}">${book.title}</div>
        ${isRead ? '<div class="library-book-read">&#10003; READ</div>' : ''}
      </div>
    `;
    div.onclick = () => openBook(book.id);
    shelves.appendChild(div);
  }
}

function openBook(bookId) {
  let book = LIBRARY_BOOKS.find(b => b.id === bookId);
  if (!book) return;
  game.flags['book_read_' + bookId] = true;
  document.getElementById('library-shelves').style.display = 'none';
  let panel = document.getElementById('library-book-panel');
  panel.style.display = 'block';
  document.getElementById('library-book-title').textContent = book.title;
  document.getElementById('library-book-title').style.color = book.color;
  document.getElementById('library-book-text').textContent = book.text;
}

function closeBook() {
  document.getElementById('library-shelves').style.display = '';
  document.getElementById('library-book-panel').style.display = 'none';
  openLibrary();
}

function closeLibrary() {
  document.getElementById('library-screen').style.display = 'none';
}
