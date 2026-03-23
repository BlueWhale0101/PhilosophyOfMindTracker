const STORAGE_KEY = "philosophyOfMindTrackerV2";

const readingListData = [
  {
    id: "montero-vsi",
    order: 1,
    title: "Philosophy of Mind: A Very Short Introduction",
    author: "Barbara Gail Montero",
    category: "Foundation",
    description: "A fast, approachable orientation to the field. Good for dualism, physicalism, and qualia."
  },
  {
    id: "minds-i",
    order: 2,
    title: "The Mind's I",
    author: "Douglas Hofstadter & Daniel Dennett",
    category: "Foundation",
    description: "A playful but serious anthology on selfhood, AI, identity, and consciousness."
  },
  {
    id: "consciousness-explained",
    order: 3,
    title: "Consciousness Explained",
    author: "Daniel Dennett",
    category: "Foundation",
    description: "A major defense of a non-mysterious account of consciousness, challenging the idea of an inner theater."
  },
  {
    id: "mind-brief-intro",
    order: 4,
    title: "Mind: A Brief Introduction",
    author: "John Searle",
    category: "Foundation",
    description: "A clear overview of core philosophy of mind positions and Searle's own biological naturalism."
  },
  {
    id: "rediscovery-mind",
    order: 5,
    title: "The Rediscovery of the Mind",
    author: "John Searle",
    category: "Core Debates",
    description: "A sharper critique of computational views of mind, including the broader implications of Searle's position."
  },
  {
    id: "metaphysics-of-mind",
    order: 6,
    title: "Philosophy of Mind / Metaphysics of Mind",
    author: "Jaegwon Kim",
    category: "Core Debates",
    description: "A more rigorous treatment of physicalism, supervenience, and the mental causation problem."
  },
  {
    id: "mind-and-world",
    order: 7,
    title: "Mind and World",
    author: "John McDowell",
    category: "Core Debates",
    description: "A deeper and more difficult work on perception, experience, and how mind relates to reality."
  },
  {
    id: "being-you",
    order: 8,
    title: "Being You",
    author: "Anil Seth",
    category: "Contemporary",
    description: "A modern bridge between neuroscience and philosophy, especially on consciousness and selfhood."
  },
  {
    id: "surfing-uncertainty",
    order: 9,
    title: "Surfing Uncertainty",
    author: "Andy Clark",
    category: "Contemporary",
    description: "An influential introduction to predictive processing and the brain as a prediction machine."
  },
  {
    id: "strange-loop",
    order: 10,
    title: "I Am a Strange Loop",
    author: "Douglas Hofstadter",
    category: "Contemporary",
    description: "A rich exploration of the self, recursion, identity, and consciousness."
  },
  {
    id: "conscious",
    order: 11,
    title: "Conscious",
    author: "Annaka Harris",
    category: "Contemporary",
    description: "A short, provocative read that opens the door to panpsychism and other nonstandard views."
  },
  {
    id: "chalmers-anthology",
    order: 12,
    title: "Philosophy of Mind: Classical and Contemporary Readings",
    author: "Edited by David Chalmers",
    category: "Anthology",
    description: "A sourcebook for reading the major arguments and original texts in one place."
  },
  {
    id: "nagel-bat",
    order: 13,
    title: "What Is It Like to Be a Bat?",
    author: "Thomas Nagel",
    category: "Papers",
    description: "Classic paper on subjectivity and the challenge of objective accounts of consciousness."
  },
  {
    id: "jackson-qualia",
    order: 14,
    title: "Epiphenomenal Qualia",
    author: "Frank Jackson",
    category: "Papers",
    description: "The famous knowledge argument and Mary thought experiment."
  },
  {
    id: "searle-programs",
    order: 15,
    title: "Minds, Brains, and Programs",
    author: "John Searle",
    category: "Papers",
    description: "The original Chinese Room paper and a key attack on strong AI."
  }
];

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
  return {
    items: {},
    meta: {
      lastUpdated: null
    }
  };
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
    applyArticleState(article, status);

    checkbox.addEventListener("change", () => {
      const nextStatus = checkbox.checked ? "done" : "not-started";
      statusSelect.value = nextStatus;
      applyArticleState(article, nextStatus);
      updateItemState(item.id, {
        status: nextStatus,
        notes: textarea.value
      });
      renderItems();
    });

    statusSelect.addEventListener("change", () => {
      const nextStatus = statusSelect.value;
      checkbox.checked = nextStatus === "done";
      applyArticleState(article, nextStatus);
      updateItemState(item.id, {
        status: nextStatus,
        notes: textarea.value
      });
      renderItems();
    });

    textarea.addEventListener("input", () => {
      updateItemState(item.id, {
        status: statusSelect.value,
        notes: textarea.value
      });
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
    state.items[item.id] = {
      status: "done",
      done: true,
      notes: prev.notes || ""
    };
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
    state.items[item.id] = {
      status,
      done: status === "done",
      notes: ""
    };
  });
  saveState(state);
  renderItems();
}

function exportProgress() {
  const state = loadState();
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "Philosophy of Mind Tracker",
    version: 2,
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
