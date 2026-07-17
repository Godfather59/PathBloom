import React, { useMemo, useState } from 'react';
import {
  clearArabicLocalizationLeaks,
  formatArabicDuration,
  formatArabicMoney,
  formatArabicNumber,
  formatArabicPercent,
  getArabicLocalizationDiagnostics,
  setArabicDigitStyle,
} from '../logic/ArabicLocalization';
import './Modal.css';

function Stat({ label, value }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '10px',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function ArabicLocalizationDashboard({ onClose, language = 'en' }) {
  const isArabic = language === 'ar';
  const [revision, setRevision] = useState(0);
  const diagnostics = useMemo(() => getArabicLocalizationDiagnostics(), [revision]);
  const labels = isArabic
    ? {
        title: 'تدقيق الترجمة العربية',
        exact: 'الترجمات المباشرة',
        entities: 'أسماء وكيانات مترجمة',
        patterns: 'قوالب ديناميكية',
        leaks: 'نصوص إنجليزية رُصدت أثناء التشغيل',
        occurrences: 'إجمالي مرات الرصد',
        digits: 'شكل الأرقام',
        western: 'أرقام غربية 123',
        arabic: 'أرقام عربية ١٢٣',
        clear: 'مسح سجل التسربات',
        refresh: 'تحديث',
        close: 'إغلاق',
        clean: 'لم يتم رصد أي تسرب إنجليزي في هذه الجلسة.',
        examples: 'أمثلة التنسيق',
        context: 'المكان',
        count: 'العدد',
      }
    : {
        title: 'Arabic Localization Audit',
        exact: 'Exact translations',
        entities: 'Localized entities',
        patterns: 'Dynamic templates',
        leaks: 'Runtime English leaks',
        occurrences: 'Total leak occurrences',
        digits: 'Digit style',
        western: 'Western digits 123',
        arabic: 'Arabic digits ١٢٣',
        clear: 'Clear leak history',
        refresh: 'Refresh',
        close: 'Close',
        clean: 'No runtime English leaks have been recorded in this session.',
        examples: 'Formatting examples',
        context: 'Context',
        count: 'Count',
      };

  const changeDigits = style => {
    setArabicDigitStyle(style);
    setRevision(value => value + 1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" dir={isArabic ? 'rtl' : 'ltr'} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h2 className="modal-title">🌙 {labels.title}</h2>
          <button className="close-btn" onClick={onClose} aria-label={labels.close}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gap: '14px' }}>
          <section className="settings-language" style={{ display: 'block' }}>
            <Stat label={labels.exact} value={diagnostics.exactTranslations} />
            <Stat label={labels.entities} value={diagnostics.entityTranslations} />
            <Stat label={labels.patterns} value={diagnostics.dynamicPatterns} />
            <Stat label={labels.leaks} value={diagnostics.runtimeLeaks} />
            <Stat label={labels.occurrences} value={diagnostics.totalLeakOccurrences} />
          </section>

          <section className="settings-language">
            <div className="settings-language-label">🔢 {labels.digits}</div>
            <div className="settings-language-options" style={{ flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`language-chip ${diagnostics.digitStyle === 'latn' ? 'active' : ''}`}
                onClick={() => changeDigits('latn')}
              >
                {labels.western}
              </button>
              <button
                type="button"
                className={`language-chip ${diagnostics.digitStyle === 'arab' ? 'active' : ''}`}
                onClick={() => changeDigits('arab')}
              >
                {labels.arabic}
              </button>
            </div>
          </section>

          <section
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.055)',
            }}
          >
            <h3 style={{ margin: '0 0 8px' }}>{labels.examples}</h3>
            <Stat label={isArabic ? 'رقم' : 'Number'} value={formatArabicNumber(1234567.5)} />
            <Stat label={isArabic ? 'مال' : 'Money'} value={formatArabicMoney(24500)} />
            <Stat label={isArabic ? 'نسبة' : 'Percent'} value={formatArabicPercent(68.4)} />
            <Stat label={isArabic ? 'مدة' : 'Duration'} value={formatArabicDuration(7, 'year')} />
          </section>

          <section>
            {diagnostics.leaks.length === 0 ? (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(46, 204, 113, 0.12)',
                }}
              >
                ✅ {labels.clean}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px', maxHeight: '260px', overflow: 'auto' }}>
                {diagnostics.leaks.map((leak, index) => (
                  <article
                    key={`${leak.context}-${leak.text}-${index}`}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div dir="ltr" style={{ textAlign: 'left', overflowWrap: 'anywhere' }}>
                      {leak.text}
                    </div>
                    <div
                      style={{
                        marginTop: '6px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {labels.context}: {leak.context} · {labels.count}: {leak.count}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => setRevision(value => value + 1)}>
              🔄 {labels.refresh}
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                clearArabicLocalizationLeaks();
                setRevision(value => value + 1);
              }}
            >
              🧹 {labels.clear}
            </button>
          </div>

          <button className="btn-primary" onClick={onClose}>
            {labels.close}
          </button>
        </div>
      </div>
    </div>
  );
}
