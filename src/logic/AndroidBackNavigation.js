const EXPLICIT_BACK_CONTROL_SELECTORS = [
  '[data-back-handler="close"]',
  '.pb-sheet-layer .pb-icon-button',
  '.decision-sheet .sheet-close',
  '.destination-overlay .destination-close',
  '.destination-close',
  '.modal-overlay .modal-close',
  '.modal-overlay .close-btn',
  '.modal-close',
  '.sheet-close',
  '.close-btn',
  '.close-button',
  '.destination-back',
  '.pb-top-bar-leading button',
];

const BLOCKING_LAYER_SELECTORS = [
  '.pb-sheet-layer',
  '.decision-sheet',
  '.destination-overlay',
  '.modal-overlay',
  '[role="dialog"][aria-modal="true"]',
];

const BACK_LABEL_PATTERN =
  /^(?:close|back|dismiss|cancel|done|exit|return|إغلاق|اغلاق|رجوع|عودة|إلغاء|الغاء|إنهاء|انهاء)$/i;

function isElementVisible(element, view) {
  if (!element || element.disabled) {
    return false;
  }

  let current = element;
  while (current) {
    if (current.hidden || current.getAttribute?.('aria-hidden') === 'true') {
      return false;
    }
    const style = view.getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }
    current = current.parentElement;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getAccessibleLabel(element) {
  return String(element.getAttribute('aria-label') || element.getAttribute('title') || '').trim();
}

function collectBackControls(doc) {
  const explicit = EXPLICIT_BACK_CONTROL_SELECTORS.flatMap(selector =>
    Array.from(doc.querySelectorAll(selector))
  );
  const accessible = Array.from(
    doc.querySelectorAll('button[aria-label], button[title], [role="button"][aria-label]')
  ).filter(element => BACK_LABEL_PATTERN.test(getAccessibleLabel(element)));

  return Array.from(new Set([...explicit, ...accessible]));
}

export function findVisibleBackControl(doc = document, view = window) {
  return collectBackControls(doc)
    .reverse()
    .find(element => isElementVisible(element, view));
}

export function hasVisibleBackLayer(doc = document, view = window) {
  return BLOCKING_LAYER_SELECTORS.some(selector =>
    Array.from(doc.querySelectorAll(selector)).some(element => isElementVisible(element, view))
  );
}

export function dispatchInGameBack(detail, target = window) {
  const event = new CustomEvent('capacitor-back', {
    detail,
    cancelable: true,
  });
  return !target.dispatchEvent(event);
}
