import {
  hasArabicText,
  hasLatinText,
  localizeArabicCandidate,
  recordArabicLeak,
  translateArabicText,
} from './ArabicLocalization';

const LANGUAGE_KEYS = ['pathbloom_language', 'lifepath_language'];
const ATTRIBUTES = ['placeholder', 'title', 'aria-label'];
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'NOSCRIPT']);
const INVALID_INDIC_RE = /[\u0900-\u097f]/;
const MIXED_SCRIPT_CORRECTIONS = Object.freeze({
  'حلاقة بज़': 'حلاقة قصيرة جدا',
});
const UI_TAGS = new Set([
  'BUTTON',
  'LABEL',
  'OPTION',
  'LEGEND',
  'SUMMARY',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'TH',
  'TD',
  'LI',
  'P',
  'SPAN',
  'DIV',
]);

let observer = null;
let languageTimer = null;
let activeLanguage = null;
let processing = false;

function getStoredLanguage() {
  try {
    for (const key of LANGUAGE_KEYS) {
      const value = localStorage.getItem(key);
      if (value) return value;
    }
  } catch {
    // Storage is optional.
  }
  return 'en';
}

function shouldSkipElement(element) {
  if (!element || SKIP_TAGS.has(element.tagName)) return true;
  if (element.closest?.('[data-no-auto-translate="true"]')) return true;
  if (element.closest?.('.content-json-editor, .code-editor, pre, code, textarea')) return true;
  return false;
}

function isLikelyUserIdentity(text, element) {
  if (!text || !element) return false;
  if (element.matches?.('[data-person-name], .person-name, .relationship-name, .leader-name')) return true;
  if (element.closest?.('[data-person-name], .person-name, .relationship-name, .leader-name')) return true;
  return /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}$/.test(text) && text.length < 40;
}

function repairMixedScript(value) {
  const text = String(value || '').trim();
  return MIXED_SCRIPT_CORRECTIONS[text] || text;
}

function translateAttribute(element, attribute) {
  if (!element.hasAttribute(attribute)) return;
  const original = element.getAttribute(attribute);
  if (!original) return;

  const repaired = repairMixedScript(original);
  if (repaired !== original) {
    element.setAttribute(attribute, repaired);
    return;
  }
  if (!hasLatinText(original) || (hasArabicText(original) && !INVALID_INDIC_RE.test(original))) return;

  const translated = translateArabicText(original, {
    context: `dom:${attribute}`,
    recordLeak: false,
  });
  if (translated !== original) {
    element.setAttribute(attribute, translated);
  } else {
    recordArabicLeak(original, `dom:${attribute}`);
  }
}

function translateTextNode(node) {
  const parent = node.parentElement;
  if (!parent || shouldSkipElement(parent) || !UI_TAGS.has(parent.tagName)) return;

  const raw = node.nodeValue || '';
  const leading = raw.match(/^\s*/)?.[0] || '';
  const trailing = raw.match(/\s*$/)?.[0] || '';
  const text = raw.trim();
  if (!text) return;

  const repaired = repairMixedScript(text);
  if (repaired !== text) {
    node.nodeValue = `${leading}${repaired}${trailing}`;
    return;
  }

  if (
    !hasLatinText(text) ||
    (hasArabicText(text) && !INVALID_INDIC_RE.test(text)) ||
    isLikelyUserIdentity(text, parent)
  )
    return;
  if (/^(?:https?:\/\/|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|[A-Z0-9_-]{8,})$/.test(text)) return;

  const translated = translateArabicText(text, {
    context: `dom:${parent.tagName.toLowerCase()}`,
    recordLeak: false,
  });
  if (translated !== text) {
    node.nodeValue = `${leading}${translated}${trailing}`;
    parent.setAttribute('dir', 'auto');
  } else {
    recordArabicLeak(text, `dom:${parent.tagName.toLowerCase()}`);
  }
}

function localizeElement(element) {
  if (!(element instanceof Element) || shouldSkipElement(element)) return;
  ATTRIBUTES.forEach(attribute => translateAttribute(element, attribute));

  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) translateTextNode(child);
  }

  element.querySelectorAll?.('*').forEach(descendant => {
    if (shouldSkipElement(descendant)) return;
    ATTRIBUTES.forEach(attribute => translateAttribute(descendant, attribute));
    for (const child of descendant.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) translateTextNode(child);
    }
  });
}

function applyDocumentDirection(language) {
  if (typeof document === 'undefined') return;
  const isArabic = language === 'ar';
  document.documentElement.lang = isArabic ? 'ar-MA' : 'en';
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  document.body?.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  document.body?.classList.toggle('language-ar', isArabic);
}

function processRoot(root = document.body) {
  if (processing || activeLanguage !== 'ar' || !root) return;
  processing = true;
  try {
    localizeElement(root);
  } finally {
    processing = false;
  }
}

function refreshLanguage() {
  const nextLanguage = getStoredLanguage();
  if (nextLanguage === activeLanguage) return;
  activeLanguage = nextLanguage;
  applyDocumentDirection(nextLanguage);
  if (nextLanguage === 'ar') requestAnimationFrame(() => processRoot());
}

export function localizeArabicUiValue(value, fallback = '', context = 'ui') {
  if (getStoredLanguage() !== 'ar') return value || fallback;
  return localizeArabicCandidate(value, fallback, context);
}

export function installArabicLocalizationRuntime() {
  if (typeof document === 'undefined' || observer) return () => {};
  activeLanguage = getStoredLanguage();
  applyDocumentDirection(activeLanguage);

  observer = new MutationObserver(mutations => {
    if (activeLanguage !== 'ar' || processing) return;
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateTextNode(mutation.target);
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) processRoot(node);
        else if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      });
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        processRoot(mutation.target);
      }
    }
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRIBUTES,
  });

  languageTimer = window.setInterval(refreshLanguage, 400);
  window.addEventListener('pathbloom-language-changed', refreshLanguage);
  if (activeLanguage === 'ar') requestAnimationFrame(() => processRoot());

  return () => {
    observer?.disconnect();
    observer = null;
    if (languageTimer) window.clearInterval(languageTimer);
    languageTimer = null;
    window.removeEventListener('pathbloom-language-changed', refreshLanguage);
  };
}
