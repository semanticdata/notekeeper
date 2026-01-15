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

  // Catppuccin
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

  // Nord theme
  nord: {
    light: {
      name: 'Nord Light',
      bg: '#eceff4',
      fg: '#4c566a',
      accent: '#5e81ac',
      border: '#d8dee9',
      subtle: '#81a1c1',
      shadow: 'rgba(216, 222, 233, 0.5)'
    },
    dark: {
      name: 'Nord Dark',
      bg: '#2e3440',
      fg: '#d8dee9',
      accent: '#88c0d0',
      border: '#4c566a',
      subtle: '#81a1c1',
      shadow: 'rgba(46, 52, 64, 0.5)'
    }
  },

  // Solarized
  solarized: {
    light: {
      name: 'Solarized Light',
      bg: '#fdf6e3',
      fg: '#657b83',
      accent: '#268bd2',
      border: '#93a1a1',
      subtle: '#586e75',
      shadow: 'rgba(147, 161, 161, 0.5)'
    },
    dark: {
      name: 'Solarized Dark',
      bg: '#002b36',
      fg: '#839496',
      accent: '#2aa198',
      border: '#073642',
      subtle: '#586e75',
      shadow: 'rgba(7, 54, 66, 0.5)'
    }
  },

  // Dracula
  dracula: {
    dark: {
      name: 'Dracula',
      bg: '#282A36',
      fg: '#F8F8F2',
      accent: '#FF79C6',
      border: '#44475A',
      subtle: '#6272A4',
      shadow: 'rgba(40, 42, 54, 0.5)'
    },
    light: {
      name: 'Alucard',
      bg: '#FFFBEB',
      fg: '#1F1F1F',
      accent: '#A3144D',
      border: '#CFCFDE',
      subtle: '#6C664B',
      shadow: 'rgba(255, 251, 235, 0.5)'
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
    } else if (themeName === 'nord') {
      // Use Nord behavior
      const currentVariant = localStorage.getItem('nord-variant') || 'light';
      theme = this.nord[currentVariant];
      isDarkMode = currentVariant === 'dark';
    } else if (themeName === 'solarized') {
      // Use Solarized behavior
      const currentVariant = localStorage.getItem('solarized-variant') || 'light';
      theme = this.solarized[currentVariant];
      isDarkMode = currentVariant === 'dark';
    } else if (themeName === 'dracula') {
      // Use Dracula behavior
      const currentVariant = localStorage.getItem('dracula-variant') || 'dark';
      theme = this.dracula[currentVariant];
      isDarkMode = currentVariant === 'dark';
    } else {
      // Direct theme selection
      if (themeName.startsWith('catppuccin-')) {
        const catppuccinVariant = themeName.replace('catppuccin-', '');
        theme = this.catppuccin[catppuccinVariant];
        isDarkMode = catppuccinVariant === 'frappe';
      } else if (themeName.startsWith('nord-')) {
        const nordVariant = themeName.replace('nord-', '');
        theme = this.nord[nordVariant];
        isDarkMode = nordVariant === 'dark';
        } else if (themeName.startsWith('solarized-')) {
          const solarizedVariant = themeName.replace('solarized-', '');
          theme = this.solarized[solarizedVariant];
          isDarkMode = solarizedVariant === 'dark';
        } else if (themeName.startsWith('dracula-')) {
          const draculaVariant = themeName.replace('dracula-', '');
          theme = this.dracula[draculaVariant];
          isDarkMode = draculaVariant === 'dark';
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
      const isCurrentDark = isDarkMode;
      themeToggle.setAttribute('aria-label', `Switch to ${isCurrentDark ? 'light' : 'dark'} theme`);
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
    } else if (currentTheme === 'nord') {
      // Toggle light/dark in nord mode
      const currentVariant = localStorage.getItem('nord-variant') || 'light';
      const nextVariant = currentVariant === 'light' ? 'dark' : 'light';
      localStorage.setItem('nord-variant', nextVariant);
      this.applyTheme('nord');
    } else if (currentTheme === 'solarized') {
      // Toggle light/dark in solarized mode
      const currentVariant = localStorage.getItem('solarized-variant') || 'light';
      const nextVariant = currentVariant === 'light' ? 'dark' : 'light';
      localStorage.setItem('solarized-variant', nextVariant);
      this.applyTheme('solarized');
    } else if (currentTheme === 'dracula') {
      // Toggle light/dark in dracula mode
      const currentVariant = localStorage.getItem('dracula-variant') || 'dark';
      const nextVariant = currentVariant === 'light' ? 'dark' : 'light';
      localStorage.setItem('dracula-variant', nextVariant);
      this.applyTheme('dracula');
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
    } else if (currentTheme === 'nord') {
      const currentVariant = localStorage.getItem('nord-variant') || 'light';
      return currentVariant === 'light' ? 'dark' : 'light';
    } else if (currentTheme === 'solarized') {
      const currentVariant = localStorage.getItem('solarized-variant') || 'light';
      return currentVariant === 'light' ? 'dark' : 'light';
    } else if (currentTheme === 'dracula') {
      const currentVariant = localStorage.getItem('dracula-variant') || 'dark';
      return currentVariant === 'light' ? 'dark' : 'light';
    }
    return currentTheme === 'light' ? 'dark' : 'light';
  },

  // Get current theme
  getCurrentTheme() {
    return localStorage.getItem('notekeeper-theme') || 'default';
  }
};

  // Initialize theme selector dropdown value
const initThemeSelector = () => {
  const currentTheme = colorManager.getCurrentTheme();
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) {
    themeSelector.value = currentTheme;
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize default variants for new themes if not set
  if (!localStorage.getItem('nord-variant')) {
    localStorage.setItem('nord-variant', 'light');
  }
  if (!localStorage.getItem('solarized-variant')) {
    localStorage.setItem('solarized-variant', 'light');
  }
  if (!localStorage.getItem('dracula-variant')) {
    localStorage.setItem('dracula-variant', 'dark');
  }

  colorManager.init();
  initThemeSelector();
});
