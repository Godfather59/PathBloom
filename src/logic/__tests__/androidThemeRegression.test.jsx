/* @vitest-environment jsdom */

import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  browserRequire,
  installBrowserRequire,
  supportedLegacyModules,
} from '../BrowserRequireBridge';
import { localizeToastMessage } from '../ToastLocalization';
import { Toast } from '../../components/Toast';

const render = component => renderToStaticMarkup(component);

describe('Android ESM compatibility', () => {
  it('resolves every legacy browser require used by App.jsx', () => {
    expect(supportedLegacyModules).toContain('./logic/Audio');
    expect(supportedLegacyModules).toContain('./logic/ImmigrationSystem');
    expect(supportedLegacyModules).toContain('./logic/TravelSystem');
    expect(browserRequire('./logic/Audio').playTap).toBeTypeOf('function');
    expect(browserRequire('./logic/ImmigrationSystem').ImmigrationManager).toBeTypeOf('function');
    expect(browserRequire('./logic/TravelSystem').travelToCity).toBeTypeOf('function');
  });

  it('installs the bridge on an Android WebView-like global object', () => {
    const webViewGlobal = {};
    expect(installBrowserRequire(webViewGlobal)).toBe(true);
    expect(webViewGlobal.require('./logic/Audio').setSfxVolume).toBeTypeOf('function');
  });

  it('does not overwrite an existing runtime require function', () => {
    const existingRequire = () => 'existing';
    const runtime = { require: existingRequire };
    expect(installBrowserRequire(runtime)).toBe(true);
    expect(runtime.require).toBe(existingRequire);
  });

  it('rejects unknown dynamic modules instead of silently failing', () => {
    expect(() => browserRequire('./logic/Unknown')).toThrow(/Unsupported browser require/);
  });
});

describe('Arabic runtime alerts', () => {
  it('localizes natural-disaster alerts and country names', () => {
    expect(
      localizeToastMessage('A devastating natural disaster has struck Egypt.', 'ar')
    ).toBe('ضربت كارثة طبيعية مدمرة مصر.');
  });

  it('renders a localized RTL toast without exposing the English alert', () => {
    localStorage.setItem('pathbloom_language', 'ar');
    const html = render(
      <Toast
        message="A devastating natural disaster has struck Egypt."
        type="bad"
        onClose={() => {}}
      />
    );
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('ضربت كارثة طبيعية مدمرة مصر');
    expect(html).not.toContain('A devastating natural disaster');
  });
});

describe('light-theme compatibility', () => {
  it('defines readable light and sepia PathBloom surfaces', () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), 'src', 'components', 'ThemeCompatibility.css'),
      'utf8'
    );
    expect(css).toContain(":root[data-theme='light']");
    expect(css).toContain('--pb-text: #142033');
    expect(css).toContain("[data-theme='light'] .timeline-card");
    expect(css).toContain("[data-theme='light'] .bottom-navigation");
    expect(css).toContain("[data-theme='light'] .hud-container");
    expect(css).toContain(":root[data-theme='sepia']");
  });
});
