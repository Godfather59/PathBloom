/* @vitest-environment jsdom */

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { translateDeepSimulationText } from '../DeepLocalization';

describe('physical Android screenshot follow-up', () => {
  it('fully localizes prefixed event-chain history in Arabic', () => {
    expect(
      translateDeepSimulationText(
        'الحدث: Your symptoms have not completely disappeared. What will you do?',
        'ar'
      )
    ).toBe('لم تختف الأعراض تماما. ماذا ستفعل؟');

    expect(translateDeepSimulationText('اخترت: Visit a doctor ($500)', 'ar')).toBe(
      'اخترت: زر طبيبا (500 دولار).'
    );

    expect(translateDeepSimulationText('You chose to: Visit a doctor ($500)', 'ar')).toBe(
      'اخترت: زر طبيبا (500 دولار).'
    );
  });

  it('removes duplicate age prefixes from the timeline body', () => {
    expect(translateDeepSimulationText('العمر 2: مر عام آخر.', 'ar')).toBe('مر عام آخر.');
    expect(translateDeepSimulationText('Age 2: Another year passed.', 'ar')).toBe('مر عام آخر.');
  });

  it('reclaims the obsolete automatic-progression lane and hides the native scrollbar', () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), 'src', 'components', 'ScreenshotFollowup.css'),
      'utf8'
    );

    expect(css).toContain('margin-top: 0');
    expect(css).toContain('scrollbar-width: none');
    expect(css).toContain('top: -18px');
  });

  it('keeps the secondary time control outside the Age Up dock', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'src', 'components', 'BottomNavigation.jsx'),
      'utf8'
    );
    const dockStart = source.indexOf('<div className="time-control-dock">');
    const dockEnd = source.indexOf('</div>', dockStart);
    const secondaryControl = source.indexOf('className="time-more-action"');

    expect(dockStart).toBeGreaterThan(-1);
    expect(dockEnd).toBeGreaterThan(dockStart);
    expect(secondaryControl).toBeGreaterThan(dockEnd);
    expect(source).toContain('<AppIcon name="fast" size={18} />');
  });
});
