// Prevent FOUC by setting theme and font size before page renders
const savedTheme = localStorage.getItem("theme");
const sysTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.setAttribute("data-theme", savedTheme || (sysTheme ? "dark" : "light"));

// Pre-load font size
const savedSize = localStorage.getItem("fontsize");
if (savedSize) document.documentElement.style.setProperty('--note-size', savedSize);
