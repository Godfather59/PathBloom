// PathBloom intentionally keeps a focused two-theme system. Older theme IDs
// are migrated so existing players never boot into an unsupported appearance.
export const THEMES = Object.freeze({
  dark: {
    name: 'Dark Mode',
    nameAr: 'الوضع الداكن',
    icon: '🌙',
    colors: {
      '--bg-deep': '#0a0a12',
      '--bg-surface': '#161622',
      '--bg-gradient': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      '--panel-bg': 'rgba(30, 30, 46, 0.96)',
      '--glass-bg': 'rgba(255, 255, 255, 0.06)',
      '--glass-border': 'rgba(255, 255, 255, 0.08)',
      '--accent-primary': '#39d98a',
      '--accent-secondary': '#67a9ff',
      '--accent-gradient': 'linear-gradient(135deg, #39d98a, #67a9ff)',
      '--success-color': '#39d98a',
      '--success-gradient': 'linear-gradient(135deg, #39d98a, #00b09b)',
      '--danger-color': '#ff6b7a',
      '--danger-gradient': 'linear-gradient(135deg, #ff6b7a, #ff5252)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b9c8dc',
      '--text-muted': '#708197',
      '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.2)',
      '--shadow-lg': '0 10px 30px rgba(0, 0, 0, 0.4)',
    },
  },
  light: {
    name: 'Clear Mode',
    nameAr: 'الوضع الفاتح',
    icon: '☀️',
    colors: {
      '--bg-deep': '#eef2f5',
      '--bg-surface': '#ffffff',
      '--bg-gradient': 'linear-gradient(135deg, #eef2f5, #f8fafc, #ffffff)',
      '--panel-bg': 'rgba(255, 255, 255, 0.98)',
      '--glass-bg': 'rgba(20, 32, 51, 0.05)',
      '--glass-border': 'rgba(24, 43, 64, 0.13)',
      '--accent-primary': '#128454',
      '--accent-secondary': '#276db8',
      '--accent-gradient': 'linear-gradient(135deg, #128454, #276db8)',
      '--success-color': '#128454',
      '--success-gradient': 'linear-gradient(135deg, #128454, #2e9f69)',
      '--danger-color': '#c52f47',
      '--danger-gradient': 'linear-gradient(135deg, #c52f47, #dc4a5f)',
      '--text-primary': '#142033',
      '--text-secondary': '#45566c',
      '--text-muted': '#718096',
      '--shadow-sm': '0 2px 8px rgba(22, 38, 56, 0.08)',
      '--shadow-lg': '0 10px 30px rgba(22, 38, 56, 0.14)',
    },
  },
});

const LEGACY_THEME_MAP = Object.freeze({
  sepia: 'light',
  forest: 'dark',
  ocean: 'dark',
  midnight: 'dark',
});

export function normalizeTheme(themeName) {
  const requested = String(themeName || '').toLowerCase();
  if (Object.hasOwn(THEMES, requested)) return requested;
  return LEGACY_THEME_MAP[requested] || 'dark';
}

export function applyTheme(themeName) {
  const resolvedName = normalizeTheme(themeName);
  const theme = THEMES[resolvedName];
  const root = document.documentElement;

  root.dataset.theme = resolvedName;
  root.style.colorScheme = resolvedName === 'light' ? 'light' : 'dark';

  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  try {
    localStorage.setItem('bitlife_theme', resolvedName);
  } catch {
    /* storage is optional */
  }

  return resolvedName;
}

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem('bitlife_theme');
    const resolved = normalizeTheme(stored);
    if (stored && stored !== resolved) {
      localStorage.setItem('bitlife_theme', resolved);
    }
    return resolved;
  } catch {
    return 'dark';
  }
}

export function getThemesList() {
  return Object.entries(THEMES).map(([id, theme]) => ({ id, ...theme }));
}
