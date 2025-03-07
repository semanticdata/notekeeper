var timeoutId;
const notes = document.getElementById("notes");
// Add event listener for keyup to save notes automatically
document.addEventListener("keyup", logKey);

// Determine browser type and set appropriate browser object
const browser_type = getBrowser();
let browser_obj;
if (browser_type === "Chrome") {
  browser_obj = chrome;
} else if (browser_type === "Firefox") {
  browser_obj = browser;
} else {
  browser_obj = chrome; // Fallback to chrome for Edge and other browsers
}

// Listen for tab and window focus changes
browser_obj.tabs.onActivated.addListener(tabOpen);
browser_obj.windows.onFocusChanged.addListener(tabOpen);

// Debounce the save operation to prevent too frequent storage updates
function logKey(e) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function () {
    saveToDB();
  }, 10);
}

// Detect browser type for compatibility
function getBrowser() {
  if (typeof chrome !== "undefined") {
    if (typeof browser !== "undefined") {
      return "Firefox";
    } else {
      return "Chrome";
    }
  } else {
    return "Edge";
  }
}

// Save notes to browser's sync storage
function saveToDB() {
  data = {
    tab_note: document.querySelector("#notes").value,
  };
  if (browser_type === "Chrome") {
    chrome.storage.sync.set(data, function () { });
  } else {
    browser_obj.storage.sync.set(data);
  }
}

// Load notes when tab changes or window focuses
function tabOpen(tab) {
  if (browser_type === "Chrome") {
    chrome.storage.sync.get(["tab_note"], function (result) {
      if (typeof result.tab_note !== "undefined") {
        document.querySelector("#notes").value = result.tab_note;
      }
    });
  } else {
    browser_obj.storage.sync.get(["tab_note"]).then((result) => {
      if (typeof result.tab_note !== "undefined") {
        document.querySelector("#notes").value = result.tab_note;
      }
    });
  }
}

// Initialize notes when page loads
window.addEventListener("load", () => {
  tabOpen();
});
