
const detailRoot = document.getElementById("detailRoot");
function normalizeStatus(itemState) {
  if (!itemState) return "not-started";
  if (itemState.status) return itemState.status;
  if (itemState.done === true) return "done";
  return "not-started";
}
function getDefaultState() { return { items: {}, meta: { lastUpdated: null } }; }
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return { items: parsed.items || {}, meta: parsed.meta || { lastUpdated: null } };
  } catch { return getDefaultState(); }
}
function saveState(state) {
  state.meta = state.meta || {};
  state.meta.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function getItemById(id) { return readingListData.find(item => item.id === id); }
function getNeighbors(index) {
  return { prev: index > 0 ? readingListData[index - 1] : null, next: index < readingListData.length - 1 ? readingListData[index + 1] : null };
}
function renderMissing() {
  detailRoot.innerHTML = `<section class="card detail-card"><p class="eyebrow">Reading detail</p><h1 class="detail-title">Item not found</h1><p class="subtitle">The reading item you're looking for is not in this tracker.</p></section>`;
}
function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const item = getItemById(id);
  if (!item) { renderMissing(); return; }
  const index = readingListData.findIndex(entry => entry.id === item.id);
  const neighbors = getNeighbors(index);
  const state = loadState();
  const saved = state.items[item.id] || { status: "not-started", notes: "" };
  const status = normalizeStatus(saved);
  detailRoot.innerHTML = `
    <section class="card detail-card">
      <p class="eyebrow">${item.category}</p>
      <h1 class="detail-title">${item.order}. ${item.title}</h1>
      <div class="meta-row">
        <span class="meta-chip">${item.author}</span>
        <span class="meta-chip">Status: <strong id="statusText" style="color:#201d1a; margin-left:4px;">${status}</strong></span>
      </div>
      <p class="item-description">${item.description}</p>
      <div class="status-row" style="margin-top:18px;">
        <label for="detailStatus">Reading status</label>
        <select id="detailStatus">
          <option value="not-started">Not started</option>
          <option value="reading">Reading</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div class="detail-notes" style="margin-top:18px;">
        <label class="field-label" for="detailNotes">Your notes</label>
        <textarea id="detailNotes" placeholder="Use this space for your own summary, objections, favorite passages, or what you want to remember later.">${saved.notes || ""}</textarea>
        <div class="note-hint">These notes sync with the main list view and save in your browser.</div>
      </div>
    </section>
    <aside>
      <section class="card summary-card">
        <div class="card-header"><h2>Memory refresh summary</h2><p>A short orientation to the work's main ideas</p></div>
        <p class="summary-copy">${item.summary}</p>
      </section>
      <section class="card nav-card" style="margin-top:18px;">
        <div class="card-header"><h2>Navigate</h2><p>Move through the reading list in order</p></div>
        <div class="nav-list">
          ${neighbors.prev ? `<a class="nav-button" href="detail.html?id=${encodeURIComponent(neighbors.prev.id)}"><small>Previous</small><strong>${neighbors.prev.order}. ${neighbors.prev.title}</strong></a>` : ""}
          ${neighbors.next ? `<a class="nav-button" href="detail.html?id=${encodeURIComponent(neighbors.next.id)}"><small>Next</small><strong>${neighbors.next.order}. ${neighbors.next.title}</strong></a>` : ""}
        </div>
      </section>
    </aside>`;
  const statusSelect = document.getElementById("detailStatus");
  const notesArea = document.getElementById("detailNotes");
  const statusText = document.getElementById("statusText");
  statusSelect.value = status;
  function persist() {
    const state = loadState();
    const nextStatus = statusSelect.value;
    state.items[item.id] = { status: nextStatus, done: nextStatus === "done", notes: notesArea.value || "" };
    saveState(state);
    statusText.textContent = nextStatus;
  }
  statusSelect.addEventListener("change", persist);
  notesArea.addEventListener("input", persist);
}
renderDetail();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => console.error("Service worker registration failed:", error));
  });
}
