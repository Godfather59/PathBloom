import { translateSupplementalArabicText } from './ArabicSupplementalCatalog';

const ATTRIBUTES = ['placeholder', 'title', 'aria-label'];
let observer = null;

function isArabicMode() {
  try {
    return (
      localStorage.getItem('pathbloom_language') === 'ar' ||
      localStorage.getItem('lifepath_language') === 'ar'
    );
  } catch {
    return false;
  }
}

function applyToElement(element) {
  if (!(element instanceof Element)) {
    return;
  }
  if (element.closest?.('pre, code, textarea, [data-no-auto-translate="true"]')) {
    return;
  }

  ATTRIBUTES.forEach(attribute => {
    const current = element.getAttribute(attribute);
    if (!current) {
      return;
    }
    const translated = translateSupplementalArabicText(current);
    if (translated !== current) {
      element.setAttribute(attribute, translated);
    }
  });

  for (const node of element.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE) {
      continue;
    }
    const raw = node.nodeValue || '';
    const text = raw.trim();
    if (!text) {
      continue;
    }
    const translated = translateSupplementalArabicText(text);
    if (translated !== text) {
      node.nodeValue = raw.replace(text, translated);
      element.setAttribute('dir', 'auto');
    }
  }
}

function process(root = document.body) {
  if (!isArabicMode() || !root) {
    return;
  }
  if (root instanceof Element) {
    applyToElement(root);
  }
  root.querySelectorAll?.('*').forEach(applyToElement);
}

export function installArabicSupplementalRuntime() {
  if (typeof document === 'undefined' || observer) {
    return () => {};
  }
  observer = new MutationObserver(mutations => {
    if (!isArabicMode()) {
      return;
    }
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          process(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
          applyToElement(node.parentElement);
        }
      });
    });
  });
  observer.observe(document.documentElement, { subtree: true, childList: true });
  requestAnimationFrame(() => process());
  window.addEventListener('pathbloom-language-changed', () =>
    requestAnimationFrame(() => process())
  );
  return () => {
    observer?.disconnect();
    observer = null;
  };
}
