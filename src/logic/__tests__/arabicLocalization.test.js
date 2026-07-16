import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearArabicLocalizationLeaks,
  formatArabicDuration,
  getArabicLocalizationDiagnostics,
  isArabicPlaceholder,
  isCompleteArabicTranslation,
  localizeArabicCandidate,
  setArabicDigitStyle,
  translateArabicEntity,
  translateArabicText,
} from '../ArabicLocalization';

describe('Arabic localization', () => {
  beforeEach(() => {
    localStorage.clear();
    clearArabicLocalizationLeaks();
    setArabicDigitStyle('latn');
  });

  it('rejects legacy AR placeholders and selects real Arabic text', () => {
    expect(isArabicPlaceholder('Confront them AR', 'Confront them')).toBe(true);
    expect(isCompleteArabicTranslation('Confront them AR', 'Confront them')).toBe(false);
    expect(localizeArabicCandidate('Confront them AR', 'Confront them', 'test')).toBe(
      'واجه شريكك'
    );
  });

  it('localizes a previously leaking generated event', () => {
    const english = 'Your partner has been texting a "friend" a lot lately. You feel jealous.';
    expect(localizeArabicCandidate(`${english} AR`, english, 'test')).toContain('يراسل شريكك');
  });

  it('localizes countries, governments, jobs and relationship roles', () => {
    expect(translateArabicEntity('Morocco')).toBe('المغرب');
    expect(translateArabicEntity('Military Junta')).toBe('مجلس عسكري');
    expect(translateArabicEntity('Programmer')).toBe('مبرمج');
    expect(translateArabicEntity('Grandchild')).toBe('حفيد');
  });

  it('localizes dynamic war, tax and career messages', () => {
    expect(translateArabicText('Morocco declared war on Spain.')).toContain('المغرب');
    expect(translateArabicText("Morocco's tax rules adjusted your annual income tax to $12,000.")).toContain(
      'قوانين الضرائب'
    );
    expect(translateArabicText('You were promoted to Manager!')).toBe('تمت ترقيتك إلى مدير!');
  });

  it('uses correct Arabic singular, dual and plural duration forms', () => {
    expect(formatArabicDuration(1, 'year')).toBe('سنة واحدة');
    expect(formatArabicDuration(2, 'year')).toBe('سنتان');
    expect(formatArabicDuration(5, 'year')).toContain('سنوات');
    expect(formatArabicDuration(1, 'month')).toBe('شهر واحد');
    expect(formatArabicDuration(2, 'month')).toBe('شهران');
    expect(formatArabicDuration(7, 'month')).toContain('أشهر');
  });

  it('records unresolved runtime English without interrupting gameplay', () => {
    const unknown = 'A completely unknown English interface sentence.';
    expect(translateArabicText(unknown, { context: 'test' })).toBe(unknown);
    const diagnostics = getArabicLocalizationDiagnostics();
    expect(diagnostics.runtimeLeaks).toBe(1);
    expect(diagnostics.leaks[0].context).toBe('test');
  });

  it('does not report properly translated Arabic as a leak', () => {
    const translated = localizeArabicCandidate('تم حفظ اللعبة!', 'Game Saved!', 'test');
    expect(translated).toBe('تم حفظ اللعبة!');
    expect(getArabicLocalizationDiagnostics().runtimeLeaks).toBe(0);
  });
});
