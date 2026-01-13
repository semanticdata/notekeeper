(function () {
    const localStorageTheme = localStorage.getItem("theme");
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    let theme = "light";
    if (localStorageTheme) {
        theme = localStorageTheme;
    } else if (systemSettingDark) {
        theme = "dark";
    }

    document.documentElement.setAttribute("data-theme", theme);
})();