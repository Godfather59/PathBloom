import React, { useMemo, useRef, useState } from 'react';
import {
  createContentPackTemplate,
  deleteCustomContentPack,
  getAllContentPacks,
  saveCustomContentPack,
  setContentPackEnabled,
  validateContentPack,
} from '../logic/ContentPackRegistry';
import './Modal.css';

function localText(value, language) {
  if (!value || typeof value !== 'object') return String(value || '');
  return String(value[language] || value.en || '');
}

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

export default function ContentStudio({
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const isArabic = language === 'ar';
  const fileInputRef = useRef(null);
  const [revision, setRevision] = useState(0);
  const [selectedPackId, setSelectedPackId] = useState(null);
  const [editorText, setEditorText] = useState(() => pretty(createContentPackTemplate()));
  const [feedback, setFeedback] = useState(null);

  const packs = useMemo(() => getAllContentPacks(), [revision]);
  const selectedPack = packs.find(pack => pack.id === selectedPackId) || null;
  const totalEvents = packs.reduce((sum, pack) => sum + pack.events.length, 0);

  const labels = isArabic
    ? {
        title: 'استوديو المحتوى', close: 'إغلاق', packs: 'حزم القصص', editor: 'محرر JSON',
        enabled: 'مفعلة', disabled: 'معطلة', builtin: 'مدمجة', custom: 'مخصصة', events: 'أحداث',
        validate: 'تحقق', save: 'احفظ الحزمة المخصصة', reset: 'قالب جديد', import: 'استيراد JSON',
        export: 'تصدير JSON', delete: 'حذف', valid: 'الحزمة صالحة', invalid: 'توجد أخطاء',
        description: 'أضف قصصا جديدة من دون تعديل محرك اللعبة. يجب توفير النص الإنجليزي والعربي لكل حدث وخيار.',
        total: 'إجمالي الأحداث', noSelection: 'اختر حزمة لعرض تفاصيلها.', source: 'المصدر',
        followups: 'روابط المتابعة', warning: 'تحذير', error: 'خطأ', copyBuiltin: 'انسخ إلى المحرر',
      }
    : {
        title: 'Content Studio', close: 'Close', packs: 'Story packs', editor: 'JSON editor',
        enabled: 'Enabled', disabled: 'Disabled', builtin: 'Built-in', custom: 'Custom', events: 'events',
        validate: 'Validate', save: 'Save custom pack', reset: 'New template', import: 'Import JSON',
        export: 'Export JSON', delete: 'Delete', valid: 'Pack is valid', invalid: 'Validation errors found',
        description: 'Add new stories without modifying the game engine. Every event and choice requires English and Arabic text.',
        total: 'Total events', noSelection: 'Select a pack to inspect it.', source: 'Source',
        followups: 'Follow-up links', warning: 'Warning', error: 'Error', copyBuiltin: 'Copy into editor',
      };

  const parseAndValidate = text => {
    try {
      return validateContentPack(JSON.parse(text));
    } catch (error) {
      return {
        valid: false,
        errors: [{ path: 'json', code: 'INVALID_JSON', message: error.message }],
        warnings: [],
        pack: null,
      };
    }
  };

  const validateEditor = () => {
    const result = parseAndValidate(editorText);
    setFeedback(result);
    return result;
  };

  const refresh = () => setRevision(value => value + 1);

  const saveEditor = () => {
    const parsed = parseAndValidate(editorText);
    if (!parsed.valid) {
      setFeedback(parsed);
      return;
    }
    const result = saveCustomContentPack(parsed.pack);
    setFeedback(result);
    if (result.valid) {
      setSelectedPackId(result.pack.id);
      refresh();
    }
  };

  const togglePack = pack => {
    setContentPackEnabled(pack.id, !pack.enabled);
    refresh();
  };

  const removePack = pack => {
    if (pack.source !== 'custom') return;
    deleteCustomContentPack(pack.id);
    if (selectedPackId === pack.id) setSelectedPackId(null);
    refresh();
  };

  const loadPackIntoEditor = pack => {
    const editable = {
      schemaVersion: pack.schemaVersion,
      id: pack.source === 'custom' ? pack.id : `${pack.id}-custom`,
      name: pack.name,
      description: pack.description,
      category: pack.category,
      countries: pack.countries,
      events: pack.events.map(event => {
        const copy = { ...event };
        delete copy.source;
        return copy;
      }),
    };
    setEditorText(pretty(editable));
    setFeedback(null);
  };

  const exportJson = () => {
    const parsed = parseAndValidate(editorText);
    const payload = parsed.pack || createContentPackTemplate();
    const blob = new Blob([`${pretty(payload)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${payload.id || 'pathbloom-content-pack'}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const importFile = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      setEditorText(text);
      setFeedback(parseAndValidate(text));
    } catch (error) {
      setFeedback({
        valid: false,
        errors: [{ path: 'file', code: 'READ_FAILED', message: error.message }],
        warnings: [],
      });
    }
  };

  const followUpCount = selectedPack
    ? selectedPack.events.reduce(
        (sum, event) => sum + event.choices.filter(choice => choice.next?.eventId).length,
        0
      )
    : 0;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{ maxWidth: '760px', width: 'min(96vw, 760px)' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">🧰 {labels.title}</h2>
          <button className="close-btn" onClick={onClose} aria-label={labels.close}>&times;</button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gap: '14px' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {labels.description}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '10px',
            }}
          >
            <div className="list-item" style={{ margin: 0, textAlign: 'center' }}>
              <strong>{packs.length}</strong><br />{labels.packs}
            </div>
            <div className="list-item" style={{ margin: 0, textAlign: 'center' }}>
              <strong>{totalEvents}</strong><br />{labels.total}
            </div>
          </div>

          <section>
            <h3 style={{ margin: '0 0 8px' }}>📚 {labels.packs}</h3>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {packs.map(pack => (
                <div
                  key={pack.id}
                  className="list-item"
                  style={{ margin: 0, padding: '11px', cursor: 'pointer' }}
                  onClick={() => setSelectedPackId(pack.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                    <div>
                      <strong>{localText(pack.name, language)}</strong>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {pack.events.length} {labels.events} · {pack.source === 'custom' ? labels.custom : labels.builtin}
                      </div>
                    </div>
                    <button
                      className={pack.enabled ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '7px 10px', minWidth: '82px' }}
                      onClick={event => {
                        event.stopPropagation();
                        togglePack(pack);
                      }}
                    >
                      {pack.enabled ? labels.enabled : labels.disabled}
                    </button>
                  </div>
                  {selectedPackId === pack.id && (
                    <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {localText(pack.description, language) || labels.noSelection}
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        {labels.source}: {pack.source === 'custom' ? labels.custom : labels.builtin} · {labels.followups}: {followUpCount}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => loadPackIntoEditor(pack)}>
                          📋 {labels.copyBuiltin}
                        </button>
                        {pack.source === 'custom' && (
                          <button className="btn-danger" style={{ padding: '8px' }} onClick={() => removePack(pack)}>
                            🗑️ {labels.delete}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ margin: '0 0 8px' }}>✍️ {labels.editor}</h3>
            <textarea
              value={editorText}
              onChange={event => {
                setEditorText(event.target.value);
                setFeedback(null);
              }}
              spellCheck={false}
              style={{
                width: '100%',
                minHeight: '300px',
                resize: 'vertical',
                boxSizing: 'border-box',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,0,0,0.28)',
                color: 'var(--text-primary)',
                fontFamily: 'Consolas, monospace',
                fontSize: '12px',
                direction: 'ltr',
                textAlign: 'left',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              <button className="btn-secondary" onClick={validateEditor}>✅ {labels.validate}</button>
              <button className="btn-primary" onClick={saveEditor}>💾 {labels.save}</button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditorText(pretty(createContentPackTemplate()));
                  setFeedback(null);
                }}
              >
                🆕 {labels.reset}
              </button>
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                📥 {labels.import}
              </button>
              <button className="btn-secondary" onClick={exportJson}>📤 {labels.export}</button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={importFile}
                style={{ display: 'none' }}
              />
            </div>
          </section>

          {feedback && (
            <section
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: feedback.valid ? 'rgba(46, 204, 113, 0.12)' : 'rgba(231, 76, 60, 0.13)',
                border: `1px solid ${feedback.valid ? 'rgba(46, 204, 113, 0.35)' : 'rgba(231, 76, 60, 0.35)'}`,
              }}
            >
              <strong>{feedback.valid ? `✅ ${labels.valid}` : `⚠️ ${labels.invalid}`}</strong>
              {(feedback.errors || []).map((error, index) => (
                <div key={`error-${index}`} style={{ marginTop: '7px', fontSize: '0.85rem' }}>
                  <strong>{labels.error}:</strong> {error.path} — {error.message}
                </div>
              ))}
              {(feedback.warnings || []).map((warning, index) => (
                <div key={`warning-${index}`} style={{ marginTop: '7px', fontSize: '0.85rem' }}>
                  <strong>{labels.warning}:</strong> {warning.path} — {warning.message}
                </div>
              ))}
            </section>
          )}

          <button className="btn-primary" onClick={onClose}>{labels.close}</button>
        </div>
      </div>
    </div>
  );
}
