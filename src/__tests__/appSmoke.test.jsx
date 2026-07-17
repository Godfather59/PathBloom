/** @vitest-environment jsdom */

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { familyTree } from '../logic/DynastyMode';
import { GameEngine } from '../logic/GameEngine';
import { SAVE_KEY_PREFIX, SAVE_VERSION } from '../logic/SaveSystem';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  disconnect() {}
};

function setInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function findButton(label) {
  return [...document.querySelectorAll('button')].find(button =>
    button.textContent?.includes(label)
  );
}

describe('App save and continue smoke test', () => {
  let container;
  let root;

  beforeEach(() => {
    localStorage.clear();
    GameEngine.resetSimulationState();
    familyTree.reset({ persist: false });
    document.body.innerHTML = '<div id="root"></div>';
    container = document.getElementById('root');
    root = createRoot(container);
  });

  afterEach(async () => {
    if (root) {
      await act(async () => root.unmount());
    }
    document.body.innerHTML = '';
  });

  it('creates a versioned slot and continues it after remounting', async () => {
    await act(async () => root.render(<App />));

    const inputs = container.querySelectorAll('.main-menu-input');
    expect(inputs).toHaveLength(2);
    await act(async () => {
      setInputValue(inputs[0], 'Browser');
      setInputValue(inputs[1], 'Smoke');
    });

    await act(async () => container.querySelector('.start-btn').click());
    const skipOnboardingButton = findButton('Skip');
    expect(skipOnboardingButton).toBeDefined();
    await act(async () => skipOnboardingButton.click());

    expect(container.querySelector('.hud-container')).not.toBeNull();
    await act(async () => container.querySelector('.hud-menu-fallback').click());
    const settingsButton = findButton('Settings');
    expect(settingsButton).toBeDefined();
    await act(async () => settingsButton.click());
    const volumeInputs = container.querySelectorAll('input[type="range"]');
    expect(volumeInputs).toHaveLength(2);
    await act(async () => setInputValue(volumeInputs[0], '0.4'));
    expect(localStorage.getItem('pathbloom_sfx_volume')).toBe('0.4');

    const metadata = JSON.parse(localStorage.getItem('bitlife_save_meta'));
    expect(metadata).toHaveLength(1);
    const saved = JSON.parse(localStorage.getItem(`${SAVE_KEY_PREFIX}${metadata[0].id}`));
    expect(saved).toMatchObject({
      version: SAVE_VERSION,
      person: { name: { first: 'Browser', last: 'Smoke' } },
      simulationState: {
        version: 1,
        engine: { version: 1 },
      },
    });

    await act(async () => root.unmount());
    container.innerHTML = '';
    root = createRoot(container);
    await act(async () => root.render(<App />));

    const continueButton = findButton('Continue Life');
    expect(continueButton).toBeDefined();
    await act(async () => continueButton.click());

    expect(container.querySelector('.hud-container')).not.toBeNull();
    expect(container.textContent).toContain('Browser Smoke');
  });
});
