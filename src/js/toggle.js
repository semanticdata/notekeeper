/* * Function to calculate current theme setting.
 * Look for a local storage value.
 * Fall back to system setting.
 * Fall back to light mode. */
function calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
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
  const newCta = isDark ? "Change to light theme" : "Change to dark theme";
  const icon = isDark ? "☀️" : "🌙";
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerHTML = icon;
}

/* Utility function to update the theme setting on the html tag */
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

// Listen for system theme changes
function handleSystemThemeChange(e) {
  if (!localStorage.getItem("theme")) {
    const newTheme = e.matches ? "dark" : "light";
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });
    currentThemeSetting = newTheme;
  }
}

/* On page load: */
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

let currentThemeSetting = calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
});

// Initialize the button and theme
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

// Add event listeners
systemSettingDark.addListener(handleSystemThemeChange);

button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });

  currentThemeSetting = newTheme;
});
