const STORAGE_KEY = "philosophyOfMindTrackerV1";

const readingListData = [
  {
    id: "montero-vsi",
    order: 1,
    title: "Philosophy of Mind: A Very Short Introduction",
    author: "Barbara Gail Montero",
    description: "A fast, approachable orientation to the field. Good for dualism, physicalism, and qualia."
  },
  {
    id: "minds-i",
    order: 2,
    title: "The Mind's I",
    author: "Douglas Hofstadter & Daniel Dennett",
    description: "A playful but serious anthology on selfhood, AI, identity, and consciousness."
  },
  {
    id: "consciousness-explained",
    order: 3,
    title: "Consciousness Explained",
    author: "Daniel Dennett",
    description: "A major defense of a non-mysterious account of consciousness, challenging the idea of an inner theater."
  },
  {
    id: "mind-brief-intro",
    order: 4,
    title: "Mind: A Brief Introduction",
    author: "John Searle",
    description: "A clear overview of core philosophy of mind positions and Searle's own biological naturalism."
  },
  {
    id: "rediscovery-mind",
    order: 5,
    title: "The Rediscovery of the Mind",
    author: "John Searle",
    description: "A sharper critique of computational views of mind, including the broader implications of Searle's position."
  },
  {
    id: "metaphysics-of-mind",
    order: 6,
    title: "Philosophy of Mind / Metaphysics of Mind",
    author: "Jaegwon Kim",
    description: "A more rigorous treatment of physicalism, supervenience, and the mental causation problem."
  },
  {
    id: "mind-and-world",
    order: 7,
    title: "Mind and World",
    author: "John McDowell",
    description: "A deeper and more difficult work on perception, experience, and how mind relates to reality."
  },
  {
    id: "being-you",
    order: 8,
    title: "Being You",
    author: "Anil Seth",
    description: "A modern bridge between neuroscience and philosophy, especially on consciousness and selfhood."
  },
  {
    id: "surfing-uncertainty",
    order: 9,
    title: "Surfing Uncertainty",
    author: "Andy Clark",
    description: "An influential introduction to predictive processing and the brain as a prediction machine."
  },
  {
    id: "strange-loop",
    order: 10,
    title: "I Am a Strange Loop",
    author: "Douglas Hofstadter",
    description: "A rich exploration of the self, recursion, identity, and consciousness."
  },
  {
    id: "conscious",
    order: 11,
    title: "Conscious",
    author: "Annaka Harris",
    description: "A short, provocative read that opens the door to panpsychism and other nonstandard views."
  },
  {
    id: "chalmers-anthology",
    order: 12,
    title: "Philosophy of Mind: Classical and Contemporary Readings",
    author: "Edited by David Chalmers",
    description: "A sourcebook for reading the major arguments and original texts in one place."
  },
  {
    id: "nagel-bat",
    order: 13,
    title: "What Is It Like to Be a Bat?",
    author: "Thomas Nagel",
    description: "Classic paper on subjectivity and the challenge of objective accounts of consciousness."
  },
  {
    id: "jackson-qualia",
    order: 14,
    title: "Epiphenomenal Qualia",
    author: "Frank Jackson",
    description: "The famous knowledge argument and Mary thought experiment."
  },
  {
    id: "searle-programs",
    order: 15,
    title: "Minds, Brains, and Programs",
    author: "John Searle",
    description: "The original Chinese Room paper and a key attack on strong AI."
  }
];

const readingList = document.getElementById("readingList");
const template = document.getElementById("itemTemplate");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const progressPct = document.getElementById("progressPct");
const progressNumber = document.getElementById("progressNumber");
const notesCount = document.getElementById("notesCount");
const remainingCount = document.getElementById("remainingCount");
const lastUpdated = document.getElementById("lastUpdated");
const ringFill = document.getElementById("ringFill");
const ringCircumference = 2 * Math.PI * 48;

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

function updateSummary() {
  const state = loadState();
  const total = readingListData.length;
  const done = readingListData.filter(item => state.items[item.id]?.done).length;
  const notes = readingListData.filter(item => (state.items[item.id]?.notes || "").trim().length > 0).length;
  const remaining = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  totalCount.textContent = total;
  doneCount.textContent = done;
  progressPct.textContent = `${pct}%`;
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
    done: Boolean(data.done),
    notes: data.notes || ""
  };
  saveState(state);
  updateSummary();
}

function renderItems() {
  const state = loadState();
  readingList.innerHTML = "";

  readingListData.forEach(item => {
    const node = template.content.cloneNode(true);
    const article = node.querySelector(".reading-item");
    const checkbox = node.querySelector(".done-checkbox");
    const orderPill = node.querySelector(".order-pill");
    const title = node.querySelector(".item-title");
    const author = node.querySelector(".item-author");
    const description = node.querySelector(".item-description");
    const textarea = node.querySelector("textarea");

    const saved = state.items[item.id] || { done: false, notes: "" };

    orderPill.textContent = item.order;
    title.textContent = item.title;
    author.textContent = item.author;
    description.textContent = item.description;
    checkbox.checked = saved.done;
    textarea.value = saved.notes;

    if (saved.done) {
      article.classList.add("done");
    }

    checkbox.addEventListener("change", () => {
      article.classList.toggle("done", checkbox.checked);
      updateItemState(item.id, {
        done: checkbox.checked,
        notes: textarea.value
      });
    });

    textarea.addEventListener("input", () => {
      updateItemState(item.id, {
        done: checkbox.checked,
        notes: textarea.value
      });
    });

    readingList.appendChild(node);
  });

  updateSummary();
}

function markAllDone() {
  const state = loadState();
  readingListData.forEach(item => {
    const prev = state.items[item.id] || {};
    state.items[item.id] = {
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
    state.items[item.id] = {
      done: Boolean(prev.done),
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
    version: 1,
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

renderItems();
