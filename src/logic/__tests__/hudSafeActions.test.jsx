/* @vitest-environment jsdom */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (...segments) => fs.readFileSync(path.join(process.cwd(), ...segments), 'utf8');

describe('Android HUD safe actions', () => {
  it('moves News and Event History below the identity row', () => {
    const hud = read('src', 'components', 'Hud.jsx');

    expect(hud).toContain('className="hud-safe-actions"');
    expect(hud).toContain("t('hud.news', 'World News')");
    expect(hud).toContain("t('hud.eventHistory', 'Event History')");
    expect(hud).not.toContain('className="hud-top-btns"');
    expect(hud).toContain('const openEventHistory = () =>');
    expect(hud).toContain("/(?:Event history|سجل الأحداث)/i");
  });

  it('keeps HUD actions below the Android status region', () => {
    const css = read('src', 'components', 'HudSafeActions.css');

    expect(css).toContain('calc(env(safe-area-inset-top) + 10px)');
    expect(css).toContain('min-height: 48px');
    expect(css).toContain('.hud-safe-actions');
  });

  it('uses a clean heart path without decorative stat dots', () => {
    const icons = read('src', 'components', 'AppIcon.jsx');
    const css = read('src', 'components', 'HudSafeActions.css');

    expect(icons).toContain('M20.84 4.61a5.5');
    expect(icons).not.toContain('M12 21s-7-4.35');
    expect(css).toContain('.compact-stat-icon::after');
    expect(css).toContain('content: none !important');
  });
});
