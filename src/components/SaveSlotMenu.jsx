import React, { useState, useEffect } from 'react';
import { readSaveMetadata, SAVE_KEY_PREFIX, SAVE_META_KEY } from '../logic/SaveSystem';
import './Modal.css';

export function SaveSlotMenu({
  onSelectSlot,
  onNewGame,
  onClose,
  onSlotsChanged,
  t = (key, fallback) => fallback || key,
}) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    try {
      setSlots(readSaveMetadata());
    } catch (error) {
      console.warn('Ignoring invalid save metadata.', error);
      setSlots([]);
    }
  }, []);

  const handleDelete = (e, slotId) => {
    e.stopPropagation();
    if (
      window.confirm(
        t(
          'saveload.deleteConfirm',
          'Are you sure you want to delete this save? This cannot be undone.'
        )
      )
    ) {
      // Remove data
      try {
        localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotId}`);
        const newSlots = slots.filter(s => s.id !== slotId);
        localStorage.setItem(SAVE_META_KEY, JSON.stringify(newSlots));
        setSlots(newSlots);
        onSlotsChanged?.(newSlots);
      } catch (error) {
        console.error('Unable to delete the save slot.', error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{t('saveload.title', 'Load Game')}</h2>
          <button className="close-btn" onClick={onClose} aria-label={t('common.close', 'Close')}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {slots.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
              {t('saveload.noSaves', 'No saved games found.')}
            </div>
          ) : (
            slots.map(slot => (
              <div
                key={slot.id}
                className="list-item"
                role="button"
                tabIndex={0}
                onClick={() => onSelectSlot(slot.id)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectSlot(slot.id);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div className="list-item-title">{slot.name}</div>
                    <div className="list-item-subtitle">
                      Age: {slot.age} - {slot.job}
                      <br />
                      <span style={{ fontSize: '0.8em', opacity: 0.6 }}>
                        Last Played: {new Date(slot.lastPlayed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-danger"
                    style={{ padding: '5px 10px', fontSize: '0.8em' }}
                    onClick={e => handleDelete(e, slot.id)}
                  >
                    {t('saveload.delete', 'Delete')}
                  </button>
                </div>
              </div>
            ))
          )}

          <div style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '20px' }}>
            <button className="btn-primary" style={{ width: '100%' }} onClick={onNewGame}>
              + {t('saveload.newLife', 'Start New Life')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
