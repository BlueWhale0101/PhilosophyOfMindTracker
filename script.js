
const readingList = document.getElementById("readingList");
const template = document.getElementById("itemTemplate");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const readingCount = document.getElementById("readingCount");
const progressNumber = document.getElementById("progressNumber");
const notesCount = document.getElementById("notesCount");
const remainingCount = document.getElementById("remainingCount");
const lastUpdated = document.getElementById("lastUpdated");
const ringFill = document.getElementById("ringFill");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const ringCircumference = 2 * Math.PI * 48;

function normalizeStatus(itemState) {
  if (!itemState) return "not-started";
  if (itemState.status) return itemState.status;
  if (itemState.done === true) return "done";
  return "not-started";
}

function getDefaultState() {
  return { items: {}, meta: { lastUpdated: null } };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return {
      items: parsed.items || {},
      meta: parsed.meta || { lastUpdated: null }
    };
  } catch {
    return getDefaultState();
  }
}

function saveState(state) {
  state.meta = state.meta || {};
  state.meta.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getVisibleItems(state) {
  const category = categoryFilter.value;
  const status = statusFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  return readingListData.filter(item => {
    const saved = state.items[item.id] || {};
    const itemStatus = normalizeStatus(saved);
    const notes = (saved.notes || "").toLowerCase();

    const matchesCategory = category === "all" || item.category.toLowerCase() === category;
    const matchesStatus = status === "all" || itemStatus === status;
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      notes.includes(query);

    return matchesCategory && matchesStatus && matchesQuery;
  });
}

function updateSummary() {
  const state = loadState();
  const total = readingListData.length;
  const done = readingListData.filter(item => normalizeStatus(state.items[item.id]) === "done").length;
  const reading = readingListData.filter(item => normalizeStatus(state.items[item.id]) === "reading").length;
  const notes = readingListData.filter(item => (state.items[item.id]?.notes || "").trim().length > 0).length;
  const remaining = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  totalCount.textContent = total;
  doneCount.textContent = done;
  readingCount.textContent = reading;
  progressNumber.textContent = `${pct}%`;
  notesCount.textContent = notes;
  remainingCount.textContent = remaining;
  lastUpdated.textContent = formatDate(state.meta?.lastUpdated);

  const offset = ringCircumference - (pct / 100) * ringCircumference;
  ringFill.style.strokeDasharray = ringCircumference.toFixed(2);
  ringFill.style.strokeDashoffset = offset.toFixed(2);
}

function updateItemState(id, data) {
  const state = loadState();
  state.items[id] = {
    status: data.status || "not-started",
    done: data.status === "done",
    notes: data.notes || ""
  };
  saveState(state);
  updateSummary();
}

function applyArticleState(article, status) {
  article.classList.remove("done", "reading");
  if (status === "done") article.classList.add("done");
  if (status === "reading") article.classList.add("reading");
}

function renderItems() {
  const state = loadState();
  const visibleItems = getVisibleItems(state);
  readingList.innerHTML = "";

  if (visibleItems.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card empty-state";
    empty.textContent = "No items match the current filters.";
    readingList.appendChild(empty);
    updateSummary();
    return;
  }

  visibleItems.forEach(item => {
    const node = template.content.cloneNode(true);
    const article = node.querySelector(".reading-item");
    const checkbox = node.querySelector(".done-checkbox");
    const orderPill = node.querySelector(".order-pill");
    const title = node.querySelector(".item-title");
    const author = node.querySelector(".item-author");
    const description = node.querySelector(".item-description");
    const textarea = node.querySelector("textarea");
    const statusSelect = node.querySelector(".status-select");
    const categoryPill = node.querySelector(".category-pill");
    const detailLink = node.querySelector(".detail-link");

    const saved = state.items[item.id] || { status: "not-started", done: false, notes: "" };
    const status = normalizeStatus(saved);

    orderPill.textContent = item.order;
    title.textContent = item.title;
    author.textContent = item.author;
    description.textContent = item.description;
    textarea.value = saved.notes || "";
    statusSelect.value = status;
    checkbox.checked = status === "done";
    categoryPill.textContent = item.category;
    detailLink.href = `detail.html?id=${encodeURIComponent(item.id)}`;
    applyArticleState(article, status);

    checkbox.addEventListener("change", () => {
      const nextStatus = checkbox.checked ? "done" : "not-started";
      statusSelect.value = nextStatus;
      applyArticleState(article, nextStatus);
      updateItemState(item.id, { status: nextStatus, notes: textarea.value });
      renderItems();
    });

    statusSelect.addEventListener("change", () => {
      const nextStatus = statusSelect.value;
      checkbox.checked = nextStatus === "done";
      applyArticleState(article, nextStatus);
      updateItemState(item.id, { status: nextStatus, notes: textarea.value });
      renderItems();
    });

    textarea.addEventListener("input", () => {
      updateItemState(item.id, { status: statusSelect.value, notes: textarea.value });
    });

    readingList.appendChild(node);
  });

  updateSummary();
}

function populateCategoryFilter() {
  const categories = [...new Set(readingListData.map(item => item.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function markAllDone() {
  const state = loadState();
  readingListData.forEach(item => {
    const prev = state.items[item.id] || {};
    state.items[item.id] = { status: "done", done: true, notes: prev.notes || "" };
  });
  saveState(state);
  renderItems();
}

function clearChecks() {
  const state = loadState();
  readingListData.forEach(item => {
    const prev = state.items[item.id] || {};
    state.items[item.id] = {
      status: prev.status === "reading" ? "reading" : "not-started",
      done: false,
      notes: prev.notes || ""
    };
  });
  saveState(state);
  renderItems();
}

function clearNotes() {
  const state = loadState();
  readingListData.forEach(item => {
    const prev = state.items[item.id] || {};
    const status = normalizeStatus(prev);
    state.items[item.id] = { status, done: status === "done", notes: "" };
  });
  saveState(state);
  renderItems();
}

function exportProgress() {
  const state = loadState();
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "Philosophy of Mind Tracker",
    version: 4,
    data: state
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const datePart = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `philosophy-of-mind-progress-${datePart}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const importedState = parsed.data || parsed;
      const normalized = {
        items: importedState.items || {},
        meta: importedState.meta || {}
      };
      saveState(normalized);
      renderItems();
      alert("Progress imported.");
    } catch {
      alert("That file could not be imported.");
    }
  };
  reader.readAsText(file);
}

document.getElementById("markAllDoneBtn").addEventListener("click", markAllDone);
document.getElementById("clearChecksBtn").addEventListener("click", clearChecks);
document.getElementById("clearNotesBtn").addEventListener("click", clearNotes);
document.getElementById("exportBtn").addEventListener("click", exportProgress);
document.getElementById("importFile").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) importProgress(file);
  event.target.value = "";
});

categoryFilter.addEventListener("change", renderItems);
statusFilter.addEventListener("change", renderItems);
searchInput.addEventListener("input", renderItems);

populateCategoryFilter();
renderItems();
