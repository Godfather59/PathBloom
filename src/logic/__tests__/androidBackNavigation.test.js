/* @vitest-environment jsdom */

import fs from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchInGameBack,
  findVisibleBackControl,
  hasVisibleBackLayer,
} from '../AndroidBackNavigation';

function makeVisible(element, width = 44, height = 44) {
  element.getBoundingClientRect = vi.fn(() => ({
    width,
    height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }));
  return element;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Android back navigation', () => {
  it('finds the latest visible close control across full-screen menus', () => {
    const first = makeVisible(document.createElement('button'));
    first.className = 'destination-close';
    document.body.append(first);

    const second = makeVisible(document.createElement('button'));
    second.setAttribute('aria-label', 'إغلاق');
    document.body.append(second);

    expect(findVisibleBackControl()).toBe(second);
  });

  it('ignores controls hidden by an ancestor', () => {
    const hiddenLayer = document.createElement('div');
    hiddenLayer.style.display = 'none';
    const hiddenClose = makeVisible(document.createElement('button'));
    hiddenClose.className = 'close-btn';
    hiddenLayer.append(hiddenClose);
    document.body.append(hiddenLayer);

    expect(findVisibleBackControl()).toBeUndefined();
  });

  it('detects a visible blocking decision layer', () => {
    const decision = makeVisible(document.createElement('section'), 320, 480);
    decision.className = 'decision-sheet';
    document.body.append(decision);

    expect(hasVisibleBackLayer()).toBe(true);
  });

  it('reports a custom in-game back event as handled when prevented', () => {
    const listener = event => event.preventDefault();
    window.addEventListener('capacitor-back', listener, { once: true });

    expect(dispatchInGameBack({ canGoBack: false })).toBe(true);
  });

  it('keeps the Capacitor handler and Android predictive-back callback enabled', () => {
    const mainSource = fs.readFileSync(path.join(process.cwd(), 'src', 'main.jsx'), 'utf8');
    const manifest = fs.readFileSync(
      path.join(process.cwd(), 'android', 'app', 'src', 'main', 'AndroidManifest.xml'),
      'utf8'
    );

    expect(mainSource).toContain('toggleBackButtonHandler({ enabled: true })');
    expect(mainSource).toContain('findVisibleBackControl()');
    expect(mainSource).toContain('window.history.back()');
    expect(manifest).toContain('android:enableOnBackInvokedCallback="true"');
  });
});
