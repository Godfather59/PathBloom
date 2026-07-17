import { HAPTICS } from './Haptics';

const RUNTIME_FLAG = Symbol.for('pathbloom.feedbackPreferencesRuntime');
const WRAPPED_FLAG = Symbol.for('pathbloom.preferenceWrappedHaptic');
let observer = null;

function storedEnabled() {
  try {
    const value = localStorage.getItem('pathbloom_haptics_enabled');
    return value === null ? true : value !== 'false';
  } catch {
    return true;
  }
}

function storeEnabled(enabled) {
  try {
    localStorage.setItem('pathbloom_haptics_enabled', enabled ? 'true' : 'false');
  } catch {
    // Preferences remain usable for the current session through React state.
  }
}

function wrapHaptics() {
  Object.keys(HAPTICS).forEach(key => {
    const original = HAPTICS[key];
    if (typeof original !== 'function' || original[WRAPPED_FLAG]) {
      return;
    }
    function preferredHaptic(...args) {
      if (!storedEnabled()) {
        return undefined;
      }
      return original(...args);
    }
    Object.defineProperty(preferredHaptic, WRAPPED_FLAG, { value: true });
    HAPTICS[key] = preferredHaptic;
  });
}

function findVibrationButtons(root = document) {
  const cards = root.querySelectorAll?.('.setting-inline-card') || [];
  for (const card of cards) {
    const heading = card.querySelector('.setting-card-heading');
    const text = String(heading?.textContent || '').toLowerCase();
    if (!/(vibration|اهتزاز)/i.test(text)) {
      continue;
    }
    const buttons = [...card.querySelectorAll('.segmented-control.compact button')];
    if (buttons.length >= 2) {
      return buttons;
    }
  }
  return [];
}

function syncVibrationUi(root = document) {
  const buttons = findVibrationButtons(root);
  if (buttons.length < 2) {
    return;
  }
  const enabled = storedEnabled();
  buttons[0].classList.toggle('is-active', enabled);
  buttons[1].classList.toggle('is-active', !enabled);
  buttons[0].setAttribute('aria-pressed', String(enabled));
  buttons[1].setAttribute('aria-pressed', String(!enabled));
}

function installPreferenceClicks() {
  document.addEventListener('click', event => {
    const button = event.target?.closest?.(
      '.setting-inline-card .segmented-control.compact button'
    );
    if (!button) {
      return;
    }
    const buttons = [...button.parentElement.querySelectorAll('button')];
    const index = buttons.indexOf(button);
    if (index !== 0 && index !== 1) {
      return;
    }
    storeEnabled(index === 0);
    queueMicrotask(() => syncVibrationUi(document));
  });
}

function installUiObserver() {
  if (typeof MutationObserver === 'undefined' || observer) {
    return;
  }
  observer = new MutationObserver(mutations => {
    const relevant = mutations.some(mutation =>
      [...mutation.addedNodes].some(
        node =>
          node.nodeType === Node.ELEMENT_NODE &&
          (node.matches?.('.setting-inline-card, .system-destination') ||
            node.querySelector?.('.setting-inline-card'))
      )
    );
    if (relevant) {
      syncVibrationUi(document);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  syncVibrationUi(document);
}

export function installFeedbackPreferencesRuntime() {
  if (globalThis[RUNTIME_FLAG]) {
    return;
  }
  globalThis[RUNTIME_FLAG] = true;
  wrapHaptics();
  installPreferenceClicks();
  installUiObserver();
}

installFeedbackPreferencesRuntime();
