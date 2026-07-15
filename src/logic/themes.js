// Theme definitions with CSS variable mappings
export const THEMES = {
  dark: {
    name: 'Dark Mode',
    icon: '🌙',
    colors: {
      '--bg-deep': '#0a0a12',
      '--bg-surface': '#161622',
      '--bg-gradient': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      '--panel-bg': 'rgba(30, 30, 46, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.06)',
      '--glass-border': 'rgba(255, 255, 255, 0.08)',
      '--accent-primary': '#7000ff',
      '--accent-secondary': '#ae00ff',
      '--accent-gradient': 'linear-gradient(135deg, #7000ff, #ae00ff)',
      '--success-color': '#00e676',
      '--success-gradient': 'linear-gradient(135deg, #00e676, #00b09b)',
      '--danger-color': '#ff1744',
      '--danger-gradient': 'linear-gradient(135deg, #ff1744, #ff5252)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#a0a0b0',
      '--text-muted': '#666677',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.2)',
      '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.4)',
    },
  },
  light: {
    name: 'Light Mode',
    icon: '☀️',
    colors: {
      '--bg-deep': '#f0f2f5',
      '--bg-surface': '#ffffff',
      '--bg-gradient': 'linear-gradient(135deg, #e0e0e0, #f5f5f5, #ffffff)',
      '--panel-bg': 'rgba(255, 255, 255, 0.97)',
      '--glass-bg': 'rgba(0, 0, 0, 0.05)',
      '--glass-border': 'rgba(0, 0, 0, 0.1)',
      '--accent-primary': '#1e88e5',
      '--accent-secondary': '#42a5f5',
      '--accent-gradient': 'linear-gradient(135deg, #1e88e5, #42a5f5)',
      '--success-color': '#2e7d32',
      '--success-gradient': 'linear-gradient(135deg, #2e7d32, #43a047)',
      '--danger-color': '#d32f2f',
      '--danger-gradient': 'linear-gradient(135deg, #d32f2f, #e53935)',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#4a4a4a',
      '--text-muted': '#7a7a7a',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
    },
  },
  sepia: {
    name: 'Sepia',
    icon: '🟫',
    colors: {
      '--bg-deep': '#f4ebd9',
      '--bg-surface': '#faf3e0',
      '--bg-gradient': 'linear-gradient(135deg, #e8dcc8, #f4ebd9, #faf3e0)',
      '--panel-bg': 'rgba(250, 243, 224, 0.97)',
      '--glass-bg': 'rgba(0, 0, 0, 0.04)',
      '--glass-border': 'rgba(0, 0, 0, 0.08)',
      '--accent-primary': '#8b5e3c',
      '--accent-secondary': '#a67c52',
      '--accent-gradient': 'linear-gradient(135deg, #8b5e3c, #a67c52)',
      '--success-color': '#5b8c3a',
      '--success-gradient': 'linear-gradient(135deg, #5b8c3a, #7cb342)',
      '--danger-color': '#b71c1c',
      '--danger-gradient': 'linear-gradient(135deg, #b71c1c, #d32f2f)',
      '--text-primary': '#2c1810',
      '--text-secondary': '#5c4033',
      '--text-muted': '#8d6e63',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
      '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.12)',
    },
  },
  forest: {
    name: 'Forest',
    icon: '🌲',
    colors: {
      '--bg-deep': '#0d1f12',
      '--bg-surface': '#1a3324',
      '--bg-gradient': 'linear-gradient(135deg, #0d1f12, #1a3324, #2d4a36)',
      '--panel-bg': 'rgba(26, 51, 36, 0.97)',
      '--glass-bg': 'rgba(255, 255, 255, 0.05)',
      '--glass-border': 'rgba(255, 255, 255, 0.07)',
      '--accent-primary': '#4caf50',
      '--accent-secondary': '#66bb6a',
      '--accent-gradient': 'linear-gradient(135deg, #4caf50, #66bb6a)',
      '--success-color': '#00e676',
      '--success-gradient': 'linear-gradient(135deg, #00e676, #00b09b)',
      '--danger-color': '#ef5350',
      '--danger-gradient': 'linear-gradient(135deg, #ef5350, #e53935)',
      '--text-primary': '#e8f5e9',
      '--text-secondary': '#a5d6a7',
      '--text-muted': '#6a8f6a',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
      '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    colors: {
      '--bg-deep': '#0a1628',
      '--bg-surface': '#0f2040',
      '--bg-gradient': 'linear-gradient(135deg, #0a1628, #0f2040, #162d50)',
      '--panel-bg': 'rgba(15, 32, 64, 0.97)',
      '--glass-bg': 'rgba(255, 255, 255, 0.05)',
      '--glass-border': 'rgba(255, 255, 255, 0.07)',
      '--accent-primary': '#2196f3',
      '--accent-secondary': '#42a5f5',
      '--accent-gradient': 'linear-gradient(135deg, #2196f3, #42a5f5)',
      '--success-color': '#00e676',
      '--success-gradient': 'linear-gradient(135deg, #00e676, #00b09b)',
      '--danger-color': '#ff1744',
      '--danger-gradient': 'linear-gradient(135deg, #ff1744, #ff5252)',
      '--text-primary': '#e3f2fd',
      '--text-secondary': '#90caf9',
      '--text-muted': '#5c7999',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
      '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
  },
  midnight: {
    name: 'Midnight',
    icon: '🌃',
    colors: {
      '--bg-deep': '#050510',
      '--bg-surface': '#0d0d1a',
      '--bg-gradient': 'linear-gradient(135deg, #050510, #0d0d1a, #1a1a2e)',
      '--panel-bg': 'rgba(13, 13, 26, 0.97)',
      '--glass-bg': 'rgba(255, 255, 255, 0.04)',
      '--glass-border': 'rgba(255, 255, 255, 0.06)',
      '--accent-primary': '#e040fb',
      '--accent-secondary': '#7c4dff',
      '--accent-gradient': 'linear-gradient(135deg, #e040fb, #7c4dff)',
      '--success-color': '#00e676',
      '--success-gradient': 'linear-gradient(135deg, #00e676, #00b09b)',
      '--danger-color': '#ff1744',
      '--danger-gradient': 'linear-gradient(135deg, #ff1744, #ff5252)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b388ff',
      '--text-muted': '#555577',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.4)',
      '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.6)',
    },
  },
};

export function applyTheme(themeName) {
  const theme = THEMES[themeName] || THEMES.dark;
  const root = document.documentElement;
  const resolvedName = THEMES[themeName] ? themeName : 'dark';

  root.dataset.theme = resolvedName;
  root.style.colorScheme = resolvedName === 'light' || resolvedName === 'sepia' ? 'light' : 'dark';

  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Save preference
  try {
    localStorage.setItem('bitlife_theme', resolvedName);
  } catch {
    /* storage is optional */
  }
}

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem('bitlife_theme');
    return stored && THEMES[stored] ? stored : 'dark';
  } catch {
    return 'dark';
  }
}

export function getThemesList() {
  return Object.keys(THEMES).map(key => ({
    id: key,
    ...THEMES[key],
  }));
}
