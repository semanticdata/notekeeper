const els = {
  html: document.documentElement,
  note: document.getElementById("notes"),
  toggleTheme: document.getElementById("theme-toggle"),
  toggleSettings: document.getElementById("settings-toggle"),
  menu: document.getElementById("settings-menu"),
  slider: document.getElementById("font-slider"),
  fontDisplay: document.getElementById("font-display"),
  fontFamily: document.getElementById("font-family"),
  themeSelector: document.getElementById("theme-selector"),
  words: document.getElementById("word-count"),
  status: document.getElementById("save-status"),
};

// Detect browser API (browser vs chrome)
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

// Storage Wrapper - now uses browser.storage.sync with proper error handling
const store = {
  get: (key, callback) => {
    const handleError = (error) => {
      if (error) {
        console.error("Storage get error:", error);
        els.status.textContent = "Error loading";
      }
    };

    if (typeof callback === "function") {
      // Chrome-style callback with error handling
      browserAPI.storage.sync.get([key], (result) => {
        if (browserAPI.runtime.lastError) {
          handleError(browserAPI.runtime.lastError);
          return;
        }
        callback(result);
      });
    } else {
      // Promise-style (Firefox) with error handling
      return browserAPI.storage.sync.get([key]).catch(handleError);
    }
  },
  set: (key, value, callback) => {
    const data = {};
    data[key] = value;

    const handleError = (error) => {
      if (error) {
        console.error("Storage set error:", error);
        els.status.textContent = "Error saving";
        els.status.classList.remove("saved");
      }
    };

    if (typeof callback === "function") {
      browserAPI.storage.sync.set(data, () => {
        if (browserAPI.runtime.lastError) {
          handleError(browserAPI.runtime.lastError);
          return;
        }
        callback();
      });
    } else {
      browserAPI.storage.sync.set(data).catch(handleError);
    }
  },
};

// LocalStorage fallback (for theme/font settings that don't need sync)
const localStore = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      console.error("LocalStorage get error:", e);
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) {
      console.error("LocalStorage set error:", e);
    }
  },
};

// Theme Logic - Now uses colorManager
const toggleTheme = () => {
  colorManager.toggleTheme();
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
  localStore.set("fontsize", size);
};

const updateFontFamily = (val) => {
  els.html.style.setProperty("--font-body", val);
  localStore.set("fontfamily", val);
};

// Menu Listeners
els.toggleSettings.addEventListener("click", toggleMenu);

els.slider.addEventListener("input", (e) => {
  updateFontSize(e.target.value);
});

els.fontFamily.addEventListener("change", (e) => {
  updateFontFamily(e.target.value);
});

els.themeSelector.addEventListener("change", (e) => {
  colorManager.applyTheme(e.target.value);
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
    store.set("notekeeper_content", text, () => {
      // Only update UI on success (error handling is in store.set)
      els.status.textContent = "Saved";
      els.status.classList.add("saved");
    });
  }, 500);
};

// Listen for storage changes from other tabs/extensions
// This keeps notes in sync across multiple tabs
browserAPI.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.notekeeper_content) {
    const newValue = changes.notekeeper_content.newValue;
    if (newValue !== undefined && newValue !== els.note.value) {
      els.note.value = newValue;
      updateStats(newValue);
      els.status.textContent = "Synced";
      els.status.classList.add("saved");
    }
  }
});

// Refresh when the page gains visibility (e.g., switching back to tab)
// This handles tab switching without requiring tabs permission
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    store.get("notekeeper_content", (result) => {
      if (result && result.notekeeper_content) {
        els.note.value = result.notekeeper_content;
        updateStats(result.notekeeper_content);
        els.status.textContent = "Restored";
        els.status.classList.add("saved");
      }
    });
  }
});

// Initialize - load from sync storage and run migration if needed
// Combined into single operation to avoid race condition
const initializeNotes = () => {
  store.get("notekeeper_content", (syncResult) => {
    if (syncResult && syncResult.notekeeper_content) {
      // We have data in sync storage, load it
      els.note.value = syncResult.notekeeper_content;
      updateStats(syncResult.notekeeper_content);
      els.status.textContent = "Restored";
      els.status.classList.add("saved");
      return;
    }

    // No sync data, check for localStorage migration
    const localContent = localStore.get("notekeeper_content");
    if (localContent) {
      console.log("Migrating notes from localStorage to sync storage...");
      store.set("notekeeper_content", localContent, () => {
        els.note.value = localContent;
        updateStats(localContent);
        els.status.textContent = "Migrated";
        els.status.classList.add("saved");
      });
      return;
    }

    // Check for legacy tab_note (from original extension)
    browserAPI.storage.sync.get(["tab_note"], (legacyResult) => {
      if (browserAPI.runtime.lastError) {
        console.error("Legacy storage check error:", browserAPI.runtime.lastError);
        return;
      }

      if (legacyResult && legacyResult.tab_note) {
        console.log("Migrating notes from legacy tab_note to notekeeper_content...");
        store.set("notekeeper_content", legacyResult.tab_note, () => {
          els.note.value = legacyResult.tab_note;
          updateStats(legacyResult.tab_note);
          els.status.textContent = "Restored";
          els.status.classList.add("saved");
        });
      }
    });
  });
};

initializeNotes();

// Init Font Size
const storedFontSize = localStore.get("fontsize");
if (storedFontSize) {
  const val = parseInt(storedFontSize);
  els.slider.value = val;
  updateFontSize(val);
}

// Init Font Family
const storedFontFamily = localStore.get("fontfamily");
if (storedFontFamily) {
  els.fontFamily.value = storedFontFamily;
  updateFontFamily(storedFontFamily);
}

// Init Theme Selector
const currentTheme = colorManager.getCurrentTheme();
if (els.themeSelector) {
  els.themeSelector.value = currentTheme;
}

// Migrate legacy theme storage for backward compatibility
const migrateLegacyTheme = () => {
  const legacyTheme = localStore.get("theme");
  if (legacyTheme && !localStorage.getItem('notekeeper-theme')) {
    // Migrate old theme to new system
    if (legacyTheme === 'light' || legacyTheme === 'dark') {
      localStorage.setItem('notekeeper-theme', legacyTheme);
      localStorage.setItem('theme', legacyTheme);
    } else if (legacyTheme === 'latte') {
      localStorage.setItem('notekeeper-theme', 'catppuccin');
      localStorage.setItem('catppuccin-variant', 'latte');
    } else if (legacyTheme === 'frappe') {
      localStorage.setItem('notekeeper-theme', 'catppuccin');
      localStorage.setItem('catppuccin-variant', 'frappe');
    }
    // Remove old theme key
    localStore.remove("theme");
  }

  // Initialize default variants for new themes if not set
  if (!localStorage.getItem('nord-variant')) {
    localStorage.setItem('nord-variant', 'light');
  }
  if (!localStorage.getItem('solarized-variant')) {
    localStorage.setItem('solarized-variant', 'light');
  }
};

migrateLegacyTheme();

els.note.addEventListener("input", (e) => {
  updateStats(e.target.value);
  save(e.target.value);
});
