// toggle.js
/* * Function to calculate current theme setting.
 * Look for a local storage value.
 * Fall back to system setting.
 * Fall back to light mode. */
function calculateSettingAsThemeString({
    localStorageTheme,
    systemSettingDark
  }) {
    if (localStorageTheme !== null) {
      return localStorageTheme;
    }
  
    if (systemSettingDark.matches) {
      return "dark";
    }
  
    return "light";
  }
  
  /* Function to update the button text and aria-label. */
  function updateButton({ buttonEl, isDark }) {
    // const newCta = isDark ? "Change to light theme" : "Change to dark theme";
    const newCta = isDark ? "🌗" : "🌓";
    // use an aria-label if you are omitting text on the button
    // and using a sun/moon icon, for example
    buttonEl.setAttribute("aria-label", newCta);
    buttonEl.innerText = newCta;
  }
  
  /* Utility function to update the theme setting on the html tag */
  function updateThemeOnHtmlEl({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme);
  }
  
  /* On page load: */
  /* 1. Grab what we need from the DOM and system settings on page load */
  const button = document.querySelector("[data-theme-toggle]");
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
  
  /* 2. Work out the current site settings */
  let currentThemeSetting = calculateSettingAsThemeString({
    localStorageTheme,
    systemSettingDark
  });
  
  /* 3. Update the theme setting and button text accoridng to current settings */
  updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
  updateThemeOnHtmlEl({ theme: currentThemeSetting });
  
  /* 4. Add an event listener to toggle the theme */
  button.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
  
    localStorage.setItem("theme", newTheme);
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });
  
    currentThemeSetting = newTheme;
  });
  
  // notepad.js
  var d = document;
  
  function supports_html5_storage() {
    try {
      return "localStorage" in window && window["localStorage"] !== null;
    } catch (e) {
      return false;
    }
  }
  
  d.addEventListener("DOMContentLoaded", function () {
    var savedContent = localStorage.getItem("notepadcontent");
    var savedFontSize = localStorage.getItem("fontsize");
    var savedFontFamily = localStorage.getItem("fontfamily");
    var savedFontColor = localStorage.getItem("fontcolor");
    var savedBgColor = localStorage.getItem("bgcolor");
  
    if (savedContent != null) {
      d.getElementById("notes").value = savedContent;
    }
  
    if (savedFontSize != null) {
      d.getElementById("notes").style.fontSize = savedFontSize;
      var fontSizeControl = d.getElementById("fontSizeControl");
      if (fontSizeControl) {
        fontSizeControl.value = savedFontSize;
      }
    }
  
    if (savedFontFamily != null) {
      d.getElementById("notes").style.fontFamily = savedFontFamily;
      var fontFamilyControl = d.getElementById("fontFamilyControl");
      if (fontFamilyControl) {
        fontFamilyControl.value = savedFontFamily;
      }
    }
  
    if (savedFontColor != null) {
      d.getElementById("notes").style.color = savedFontColor;
      var fontColorControl = d.getElementById("fontColorControl");
      if (fontColorControl) {
        fontColorControl.value = savedFontColor;
      }
    }
  
    if (savedBgColor != null) {
      d.getElementById("notes").style.backgroundColor = savedBgColor;
      var bgColorControl = d.getElementById("bgColorControl");
      if (bgColorControl) {
        bgColorControl.value = savedBgColor;
      }
    }
  
    var notesElement = d.getElementById("notes");
    if (notesElement) {
      notesElement.onkeyup = function () {
        var data = notesElement.value;
        localStorage.setItem("notepadcontent", data);
      };
    }
  
    var fontSizeControl = d.getElementById("fontSizeControl");
    if (fontSizeControl) {
      fontSizeControl.onchange = function () {
        var fontSize = fontSizeControl.value;
        notesElement.style.fontSize = fontSize;
        localStorage.setItem("fontsize", fontSize);
      };
    }
  
    var fontFamilyControl = d.getElementById("fontFamilyControl");
    if (fontFamilyControl) {
      fontFamilyControl.onchange = function () {
        var fontFamily = fontFamilyControl.value;
        notesElement.style.fontFamily = fontFamily;
        localStorage.setItem("fontfamily", fontFamily);
      };
    }
  
    var fontColorControl = d.getElementById("fontColorControl");
    if (fontColorControl) {
      fontColorControl.onchange = function () {
        var fontColor = fontColorControl.value;
        notesElement.style.color = fontColor;
        localStorage.setItem("fontcolor", fontColor);
      };
    }
  
    var bgColorControl = d.getElementById("bgColorControl");
    if (bgColorControl) {
      bgColorControl.onchange = function () {
        var bgColor = bgColorControl.value;
        notesElement.style.backgroundColor = bgColor;
        localStorage.setItem("bgcolor", bgColor);
      };
    }
  });
  
  var timeoutId;
  const notes = document.getElementById("notes");
  document.addEventListener("keyup", logKey);
  
  const browser_type = getBrowser();
  
  let browser_obj;
  
  if (browser_type === "Chrome") {
    browser_obj = chrome;
  } else if (browser_type === "Firefox") {
    browser_obj = typeof browser !== "undefined" ? browser : chrome;
  } else {
    browser_obj = chrome;
  }
  
  if (browser_obj.tabs && browser_obj.tabs.onActivated) {
    browser_obj.tabs.onActivated.addListener(tabOpen);
  }
  
  if (browser_obj.windows && browser_obj.windows.onFocusChanged) {
    browser_obj.windows.onFocusChanged.addListener(tabOpen);
  }
  
  function logKey(e) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      saveToDB();
    }, 10);
  }
  
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
  
  function saveToDB() {
    const data = {
      tab_note: document.querySelector("#notes").value
    };
    if (browser_type === "Chrome") {
      chrome.storage.sync.set(data, function () {});
    } else if (browser_obj && browser_obj.storage && browser_obj.storage.sync) {
      browser_obj.storage.sync.set(data).catch((error) => {
        console.error("Error saving to storage: ", error);
      });
    } else {
      console.error("Storage sync API is not available.");
    }
  }
  
  function tabOpen(tab) {
    if (browser_type === "Chrome") {
      chrome.storage.sync.get(["tab_note"], function (result) {
        if (typeof result.tab_note !== "undefined") {
          document.querySelector("#notes").value = result.tab_note;
        }
      });
    } else if (browser_obj && browser_obj.storage && browser_obj.storage.sync) {
      browser_obj.storage.sync
        .get(["tab_note"])
        .then((result) => {
          if (typeof result.tab_note !== "undefined") {
            document.querySelector("#notes").value = result.tab_note;
          }
        })
        .catch((error) => {
          console.error("Error retrieving from storage: ", error);
        });
    } else {
      console.error("Storage sync API is not available.");
    }
  }
  
  window.addEventListener("load", () => {
    tabOpen();
  });
  
  // Off-Canvas Top
  (function (w) {
    var $container = $(".offcanvas-top"),
      $cHeight = $(".o-content").outerHeight();
    $(document).ready(function () {
      buildCanvas();
    });
  
    function buildCanvas() {
      $('<a href="#" id="trigger">More +</a>').appendTo($container);
  
      $("#trigger").bind("click", function (e) {
        e.preventDefault();
        var $this = $(this);
        $container.toggleClass("active");
        if ($container.hasClass("active")) {
          $container.height($cHeight);
          $this.text("Hide -");
        } else {
          $container.height(55); // default: 50
          $this.text("More +");
        }
      });
    }
  
    $(window).resize(function () {
      //On Window resizeBy(
      $cHeight = $(".o-content").outerHeight();
      console.log($cHeight);
    });
  })(this);
  