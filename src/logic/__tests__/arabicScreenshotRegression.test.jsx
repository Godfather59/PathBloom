/* @vitest-environment jsdom */

import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BottomNavigation } from '../../components/BottomNavigation';
import {
  replaceKnownEnglishEntitiesInArabic,
  translateSupplementalArabicText,
} from '../ArabicSupplementalCatalog';

const render = component => renderToStaticMarkup(component);

describe('Arabic screenshot regressions', () => {
  it('keeps one-year progression primary and hides automatic progression behind more controls', () => {
    const html = render(
      <BottomNavigation
        language="ar"
        primaryLabel="تقدم سنة"
        primaryHint="تقدم سنة واحدة"
        smartLabel="ذكي +5"
        onNavigate={() => {}}
        onPrimaryAction={() => {}}
        onSmartAdvance={() => {}}
      />
    );

    expect(html).toContain('سنة واحدة');
    expect(html).toContain('المزيد من أدوات الوقت');
    expect(html).toContain('ذكي +5');
    expect(html).not.toContain('تلقائي: 5 سنوات');
    expect(html).not.toContain('يتوقف عند ظهور قرار');
    expect(html).toContain('الأنشطة');
    expect((html.match(/time-primary-action/g) || []).length).toBe(1);
  });

  it('translates the exact mixed Arabic relationship event from the phone screenshot', () => {
    expect(translateSupplementalArabicText('انتقل Dad إلى Germany لبدء فصل جديد.')).toBe(
      'انتقل والدك إلى ألمانيا لبدء فصل جديد.'
    );
  });

  it('translates the English source event while preserving real person names', () => {
    expect(translateSupplementalArabicText('Dad moved to Germany to start a new chapter.')).toBe(
      'انتقل والدك إلى ألمانيا لبدء فصل جديد.'
    );

    expect(replaceKnownEnglishEntitiesInArabic('انتقل Thomas إلى Germany لبدء فصل جديد.')).toBe(
      'انتقل Thomas إلى ألمانيا لبدء فصل جديد.'
    );
  });

  it('translates common dynamic market headlines', () => {
    expect(translateSupplementalArabicText('Dogecoin surged!')).toBe('ارتفع سعر دوجكوين بقوة!');
    expect(translateSupplementalArabicText('Ethereum crashed!')).toBe('انهار سعر إيثيريوم!');
  });

  it('keeps Activities visibly tappable beside the selected Life destination', () => {
    const css = fs.readFileSync(
      path.join(process.cwd(), 'src', 'components', 'ShellRefresh.css'),
      'utf8'
    );

    expect(css).toContain('.bottom-nav-item');
    expect(css).toContain('.time-primary-action');
    expect(css).toContain('.time-more-action');
  });
});
