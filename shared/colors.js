// Color Management System for NoteKeeper
const colorManager = {
  // Default themes (original)
  defaults: {
    light: {
      name: 'Default Light',
      bg: '#ffffff',
      fg: '#1a1a1a',
      accent: '#27ae60',
      border: '#e0e0e0',
      subtle: '#666',
      shadow: 'rgba(0, 0, 0, 0.1)'
    },
    dark: {
      name: 'Default Dark',
      bg: '#111111',
      fg: '#f0f0f0',
      accent: '#27ae60',
      border: '#333333',
      subtle: '#888',
      shadow: 'rgba(0, 0, 0, 0.5)'
    }
  },

  // Catppuccin-inspired color presets
  catppuccin: {
    latte: {
      name: 'Catppuccin Latte',
      bg: '#eff1f5',
      fg: '#4c4f69',
      accent: '#1e66f5',
      border: '#dce0e8',
      subtle: '#8c8fa1',
      shadow: 'rgba(220, 224, 232, 0.5)'
    },
    frappe: {
      name: 'Catppuccin Frappé',
      bg: '#303446',
      fg: '#c6d0f5',
      accent: '#8caaee',
      border: '#51576d',
      subtle: '#838ba7',
      shadow: 'rgba(30, 32, 48, 0.5)'
    }
  },

  // Initialize color system
  init() {
    const savedTheme = localStorage.getItem('notekeeper-theme') || 'default';
    this.applyTheme(savedTheme);
  },

  // Apply theme colors
  applyTheme(themeName) {
    let theme;
    let isDarkMode = false;
    
    // Handle theme selection
    if (themeName === 'default') {
      // Use original light/dark toggle behavior
      const currentMode = localStorage.getItem('theme') || 'light';
      theme = this.defaults[currentMode];
      isDarkMode = currentMode === 'dark';
    } else if (themeName === 'catppuccin') {
      // Use Catppuccin behavior
      const currentVariant = localStorage.getItem('catppuccin-variant') || 'latte';
      theme = this.catppuccin[currentVariant];
      isDarkMode = currentVariant === 'frappe';
    } else {
      // Direct theme selection
      if (themeName.startsWith('catppuccin-')) {
        const catppuccinVariant = themeName.replace('catppuccin-', '');
        theme = this.catppuccin[catppuccinVariant];
        isDarkMode = catppuccinVariant === 'frappe';
      } else {
        theme = this.defaults[themeName];
        isDarkMode = themeName === 'dark';
      }
    }
    
    if (!theme) return;

    // Apply colors to CSS custom properties
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') {
        document.documentElement.style.setProperty(`--user-${key}`, value);
      }
    });

    // Update theme attribute for existing CSS
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Save preference
    localStorage.setItem('notekeeper-theme', themeName);
    
    // Update theme toggle aria-label
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const nextTheme = this.getNextTheme(themeName);
      const isNextDark = nextTheme === 'dark' || nextTheme === 'frappe';
      themeToggle.setAttribute('aria-label', `Switch to ${isNextDark ? 'light' : 'dark'} theme`);
    }
  },

  // Toggle between themes
  toggleTheme() {
    const currentTheme = localStorage.getItem('notekeeper-theme') || 'default';

    if (currentTheme === 'default') {
      // Toggle light/dark in default mode
      const currentMode = localStorage.getItem('theme') || 'light';
      const nextMode = currentMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', nextMode);
      this.applyTheme('default');
    } else if (currentTheme === 'catppuccin') {
      // Toggle latte/frappe in catppuccin mode
      const currentVariant = localStorage.getItem('catppuccin-variant') || 'latte';
      const nextVariant = currentVariant === 'latte' ? 'frappe' : 'latte';
      localStorage.setItem('catppuccin-variant', nextVariant);
      this.applyTheme('catppuccin');
    } else {
      // Direct theme selection - toggle between default themes
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('notekeeper-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      this.applyTheme('default');
    }
  },

  // Get next theme for aria-label (informational only)
  getNextTheme(currentTheme) {
    if (currentTheme === 'default') {
      const currentMode = localStorage.getItem('theme') || 'light';
      return currentMode === 'light' ? 'dark' : 'light';
    } else if (currentTheme === 'catppuccin') {
      const currentVariant = localStorage.getItem('catppuccin-variant') || 'latte';
      return currentVariant === 'latte' ? 'frappe' : 'latte';
    }
    return currentTheme === 'light' ? 'dark' : 'light';
  },

  // Get current theme
  getCurrentTheme() {
    return localStorage.getItem('notekeeper-theme') || 'default';
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  colorManager.init();
});
