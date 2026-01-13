const els = {
  html: document.documentElement,
  note: document.getElementById("notes"),
  toggleTheme: document.getElementById("theme-toggle"),
  toggleSettings: document.getElementById("settings-toggle"),
  menu: document.getElementById("settings-menu"),
  slider: document.getElementById("font-slider"),
  fontDisplay: document.getElementById("font-display"),
  words: document.getElementById("word-count"),
  status: document.getElementById("save-status"),
};

// Storage Wrapper
const store = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch (e) {}
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  },
};

// Theme Logic
const toggleTheme = () => {
  const next =
    els.html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  els.html.setAttribute("data-theme", next);
  store.set("theme", next);
  els.toggleTheme.setAttribute(
    "aria-label",
    `Switch to ${next === "dark" ? "light" : "dark"}`
  );
};

els.toggleTheme.addEventListener("click", toggleTheme);

// Settings & Menu Logic
const toggleMenu = (e) => {
  e.stopPropagation();
  const isHidden = els.menu.hidden;
  els.menu.hidden = !isHidden;
  els.toggleSettings.setAttribute("aria-expanded", !isHidden);
};

const updateFontSize = (val) => {
  const size = `${val}px`;
  els.html.style.setProperty("--note-size", size);
  els.fontDisplay.textContent = size;
  store.set("fontsize", size);
};

// Menu Listeners
els.toggleSettings.addEventListener("click", toggleMenu);

els.slider.addEventListener("input", (e) => {
  updateFontSize(e.target.value);
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !els.menu.hidden &&
    !els.menu.contains(e.target) &&
    e.target !== els.toggleSettings
  ) {
    els.menu.hidden = true;
    els.toggleSettings.setAttribute("aria-expanded", "false");
  }
});

// Stats Logic
const updateStats = (text) => {
  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  els.words.textContent = `${count} word${count === 1 ? "" : "s"}`;
};

// Save Logic (Debounced)
let timeout;
const save = (text) => {
  els.status.textContent = "Saving...";
  els.status.classList.remove("saved");
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    store.set("notekeeper_content", text);
    els.status.textContent = "Saved";
    els.status.classList.add("saved");
  }, 500);
};

// Migration Logic (Legacy Chrome Storage -> LocalStorage)
const migrateFromExtension = () => {
  // If we already have data in the new system, do not overwrite
  if (store.get("notekeeper_content")) return;

  // Detect extension environment
  const ext =
    typeof browser !== "undefined"
      ? browser
      : typeof chrome !== "undefined"
      ? chrome
      : null;

  if (ext && ext.storage && ext.storage.sync) {
    ext.storage.sync.get(["tab_note"], (result) => {
      // Check if legacy data exists
      if (result && result.tab_note) {
        // Save to new storage
        store.set("notekeeper_content", result.tab_note);

        // Update UI immediately
        els.note.value = result.tab_note;
        updateStats(result.tab_note);
        els.status.textContent = "Restored";
        els.status.classList.add("saved");
      }
    });
  }
};

// Init Content
const content = store.get("notekeeper_content");
if (content) {
  els.note.value = content;
  updateStats(content);
} else {
  // Only attempt migration if new storage is empty
  migrateFromExtension();
}

// Init Font Size
const storedFontSize = store.get("fontsize");
if (storedFontSize) {
  const val = parseInt(storedFontSize);
  els.slider.value = val;
  updateFontSize(val);
}

els.note.addEventListener("input", (e) => {
  updateStats(e.target.value);
  save(e.target.value);
});
