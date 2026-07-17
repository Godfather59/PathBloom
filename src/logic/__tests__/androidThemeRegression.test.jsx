/* @vitest-environment jsdom */

import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  browserRequire,
  installBrowserRequire,
  supportedLegacyModules,
} from '../BrowserRequireBridge';
import { localizeToastMessage } from '../ToastLocalization';
import { applyTheme, getStoredTheme, normalizeTheme, THEMES } from '../themes';
import { orderHistoryNewestFirst } from '../HistoryOrdering';
import { MainMenu } from '../../components/MainMenu';
import { Toast } from '../../components/Toast';

const render = component => renderToStaticMarkup(component);
const readComponentCss = fileName =>
  fs.readFileSync(path.join(process.cwd(), 'src', 'components', fileName), 'utf8');
const readComponentSource = fileName =>
  fs.readFileSync(path.join(process.cwd(), 'src', 'components', fileName), 'utf8');

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
  beforeEach(() => localStorage.clear());

  it('localizes natural-disaster alerts and country names', () => {
    expect(localizeToastMessage('A devastating natural disaster has struck Egypt.', 'ar')).toBe(
      'ضربت كارثة طبيعية مدمرة مصر.'
    );
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

describe('life timeline position', () => {
  it('keeps the current age first for native newest-first histories', () => {
    const history = [{ age: 7 }, { age: 6 }, { age: 0 }];
    expect(orderHistoryNewestFirst(history).map(event => event.age)).toEqual([7, 6, 0]);
    expect(history.map(event => event.age)).toEqual([7, 6, 0]);
  });

  it('repairs older ascending save histories before display', () => {
    const history = [{ age: 0 }, { age: 6 }, { age: 7 }];
    expect(orderHistoryNewestFirst(history).map(event => event.age)).toEqual([7, 6, 0]);
  });
});

describe('focused appearance modes', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('exposes only dark mode and clear mode', () => {
    expect(Object.keys(THEMES)).toEqual(['dark', 'light']);
    expect(THEMES.dark.name).toBe('Dark Mode');
    expect(THEMES.light.name).toBe('Clear Mode');
  });

  it('migrates every retired theme to a supported mode', () => {
    expect(normalizeTheme('sepia')).toBe('light');
    expect(normalizeTheme('forest')).toBe('dark');
    expect(normalizeTheme('ocean')).toBe('dark');
    expect(normalizeTheme('midnight')).toBe('dark');

    localStorage.setItem('bitlife_theme', 'sepia');
    expect(getStoredTheme()).toBe('light');
    expect(localStorage.getItem('bitlife_theme')).toBe('light');
  });

  it('applies readable clear-mode surfaces without legacy theme selectors', () => {
    expect(applyTheme('light')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');

    const css = readComponentCss('ThemeCompatibility.css');
    expect(css).toContain(":root[data-theme='light']");
    expect(css).toContain('--pb-text: #142033');
    expect(css).toContain("[data-theme='light'] .timeline-card");
    expect(css).toContain("[data-theme='light'] .bottom-navigation");
    expect(css).toContain("[data-theme='light'] .hud-container");
    expect(css).not.toContain("data-theme='sepia'");
    expect(css).not.toContain("data-theme='forest'");
  });
});

describe('Arabic new-life setup', () => {
  beforeEach(() => localStorage.clear());

  it('renders the first native RTL identity step and preserves Morocco as the settings default', () => {
    const html = render(
      <MainMenu
        language="ar"
        onLanguageChange={() => {}}
        onStartGame={() => {}}
        onStartDailyLife={() => {}}
        hasSave={false}
      />
    );
    const source = readComponentSource('MainMenu.jsx');

    expect(html).toContain('dir="rtl"');
    expect(html).toContain('الاسم الأول');
    expect(html).toContain('اسم العائلة');
    expect(html).toContain('اكتب الاسم الأول');
    expect(html).toContain('1. الهوية');
    expect(html).toContain('2. إعدادات الحياة');
    expect(html).toContain('متابعة');
    expect(html).not.toContain('ابدأ الحياة');
    expect(source).toContain("isRtl ? 'Morocco' : 'United States'");
  });

  it('starts directly without importing or rendering AvatarCreator', () => {
    const source = readComponentSource('MainMenu.jsx');
    expect(source).not.toContain('import AvatarCreator');
    expect(source).not.toContain('showAvatarCreator');
    expect(source).not.toContain('<AvatarCreator');
    expect(source).not.toContain('avatarData');
  });
});

describe('physical Android RTL screenshot fixes', () => {
  it('keeps the timeline rail on the right without reversing card text', () => {
    const css = readComponentCss('ScreenshotRegressionFixes.css');
    expect(css).toContain(".event-log[dir='rtl'] .timeline-event");
    expect(css).toContain('direction: ltr');
    expect(css).toContain(".event-log[dir='rtl'] .timeline-card");
    expect(css).toContain('direction: rtl');
  });

  it('isolates Arabic labels from LTR currency values', () => {
    const css = readComponentCss('ScreenshotRegressionFixes.css');
    expect(css).toContain(".hud-container[dir='rtl'] .hud-money");
    expect(css).toContain('unicode-bidi: isolate');
  });

  it('keeps the numbered World News control inside the first compact HUD row', () => {
    const css = readComponentCss('ScreenshotRegressionFixes.css');
    expect(css).toContain('@media (max-width: 420px)');
    expect(css).toContain('grid-template-columns: auto minmax(0, 1fr) auto auto');
    expect(css).toContain('.hud-top-btns');
    expect(css).toContain('grid-row: 1');
    expect(css).toContain('.news-btn-count');
  });

  it('keeps automatic progression behind a separate confirmation control', () => {
    const css = readComponentCss('ShellRefresh.css');
    expect(css).toContain('.bottom-navigation');
    expect(css).toContain('.time-primary-action');
    expect(css).toContain('.time-more-action');
    expect(css).toContain('top: -35px');
    expect(css).not.toContain('.time-smart-action');
  });
});
