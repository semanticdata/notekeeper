// Prevent FOUC by setting theme and font size before page renders
const savedTheme = localStorage.getItem("notekeeper-theme") || localStorage.getItem("theme");
const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Determine actual theme to apply
let actualTheme = savedTheme;
if (savedTheme === 'default') {
  // For default theme, check the legacy theme storage
  const legacyTheme = localStorage.getItem("theme");
  actualTheme = legacyTheme || (sysTheme ? "dark" : "light");
} else if (savedTheme === 'catppuccin') {
  // For catppuccin theme, check the variant storage
  const catppuccinVariant = localStorage.getItem("catppuccin-variant") || "latte";
  actualTheme = catppuccinVariant === "frappe" ? "dark" : "light";
} else if (savedTheme === 'nord') {
  // For nord theme, check the variant storage
  const nordVariant = localStorage.getItem("nord-variant") || "light";
  actualTheme = nordVariant === "dark" ? "dark" : "light";
} else if (savedTheme === 'solarized') {
  // For solarized theme, check the variant storage
  const solarizedVariant = localStorage.getItem("solarized-variant") || "light";
  actualTheme = solarizedVariant === "dark" ? "dark" : "light";
}

document.documentElement.setAttribute("data-theme", actualTheme || (sysTheme ? "dark" : "light"));

// Pre-load font size
const savedSize = localStorage.getItem("fontsize");
if (savedSize) document.documentElement.style.setProperty('--note-size', savedSize);
