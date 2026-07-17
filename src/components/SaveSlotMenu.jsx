import React, { useState, useEffect } from 'react';
import { deleteSaveTransaction, inspectSaveSlot } from '../logic/SaveReliability';
import './Modal.css';
import './ReleasePolish.css';

function currentLanguage() {
  try {
    return localStorage.getItem('pathbloom_language') === 'ar' ||
      localStorage.getItem('lifepath_language') === 'ar'
      ? 'ar'
      : 'en';
  } catch {
    return 'en';
  }
}

export function SaveSlotMenu({
  onSelectSlot,
  onNewGame,
  onClose,
  onSlotsChanged,
  t = (key, fallback) => fallback || key,
}) {
  const [slots, setSlots] = useState([]);
  const language = currentLanguage();
  const isArabic = language === 'ar';

  useEffect(() => {
    try {
      const meta = localStorage.getItem('bitlife_save_meta');
      if (meta) {
        const parsed = JSON.parse(meta);
        const validSlots = Array.isArray(parsed)
          ? parsed
              .filter(slot => slot && typeof slot.id === 'string' && typeof slot.name === 'string')
              .map(slot => ({ ...slot, saveHealth: inspectSaveSlot(slot.id) }))
              .filter(slot => slot.saveHealth.loadable)
          : [];
        setSlots(validSlots);
      }
    } catch (error) {
      console.warn('Ignoring invalid save metadata.', error);
      setSlots([]);
    }
  }, []);

  const handleDelete = (event, slotId) => {
    event.stopPropagation();
    if (
      window.confirm(
        t(
          'saveload.deleteConfirm',
          isArabic
            ? 'هل أنت متأكد من حذف هذا الحفظ؟ لا يمكن التراجع عن ذلك.'
            : 'Are you sure you want to delete this save? This cannot be undone.'
        )
      )
    ) {
      try {
        deleteSaveTransaction(slotId);
        const newSlots = slots.filter(slot => slot.id !== slotId);
        localStorage.setItem(
          'bitlife_save_meta',
          JSON.stringify(newSlots.map(({ saveHealth, ...slot }) => slot))
        );
        setSlots(newSlots);
        onSlotsChanged?.(newSlots);
      } catch (error) {
        console.error('Unable to delete the save slot.', error);
      }
    }
  };

  const statusCopy = health => {
    if (health?.recoveryAvailable || health?.status === 'recoverable') {
      return isArabic ? 'نسخة قابلة للاسترداد' : 'Recovery available';
    }
    if (health?.backupAvailable) {
      return isArabic ? 'نسخة احتياطية جاهزة' : 'Backup ready';
    }
    return isArabic ? 'حفظ سليم' : 'Healthy save';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content save-slot-release" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h2 className="modal-title">
            {t('saveload.title', isArabic ? 'تحميل لعبة' : 'Load Game')}
          </h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label={t('common.close', isArabic ? 'إغلاق' : 'Close')}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          {slots.length === 0 ? (
            <div className="save-slot-empty">
              <span aria-hidden="true">🌱</span>
              <strong>
                {t(
                  'saveload.noSaves',
                  isArabic ? 'لا توجد ألعاب محفوظة.' : 'No saved games found.'
                )}
              </strong>
              <small>
                {isArabic
                  ? 'ابدأ حياة جديدة وسيحمي الحفظ التلقائي تقدمك.'
                  : 'Start a new life and autosave will protect your progress.'}
              </small>
            </div>
          ) : (
            <div className="save-slot-list">
              {slots.map(slot => (
                <div
                  key={slot.id}
                  className="save-slot-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectSlot(slot.id)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectSlot(slot.id);
                    }
                  }}
                >
                  <div className="save-slot-card-main">
                    <span className="save-slot-avatar" aria-hidden="true">
                      🌿
                    </span>
                    <span className="save-slot-copy">
                      <strong dir="auto">{slot.name}</strong>
                      <small dir="auto">
                        {isArabic ? 'العمر' : 'Age'} {slot.age} · {slot.job}
                      </small>
                      <span
                        className={`save-slot-health ${slot.saveHealth.recoveryAvailable ? 'is-recovery' : 'is-healthy'}`}
                      >
                        {statusCopy(slot.saveHealth)}
                      </span>
                    </span>
                    <span className="save-slot-date">
                      {new Date(slot.lastPlayed).toLocaleDateString(isArabic ? 'ar-MA' : 'en-US')}
                    </span>
                  </div>
                  <div className="save-slot-actions">
                    <button
                      type="button"
                      className="save-slot-load"
                      onClick={() => onSelectSlot(slot.id)}
                    >
                      {isArabic ? 'تابع' : 'Continue'}
                    </button>
                    <button
                      type="button"
                      className="save-slot-delete"
                      onClick={event => handleDelete(event, slot.id)}
                    >
                      {t('saveload.delete', isArabic ? 'حذف' : 'Delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="save-slot-new">
            <button className="btn-primary" onClick={onNewGame}>
              + {t('saveload.newLife', isArabic ? 'ابدأ حياة جديدة' : 'Start New Life')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
