import React, { useEffect, useMemo, useState } from 'react';
import { getRuntimeLanguage, localizeToastMessage } from '../logic/ToastLocalization';
import './Toast.css';

export function Toast({ message, type, onClose, duration = 3000 }) {
  const [closing, setClosing] = useState(false);
  const language = getRuntimeLanguage();
  const localizedMessage = useMemo(
    () => localizeToastMessage(message, language),
    [message, language]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div
        className={`toast-message toast-type-${type} ${closing ? 'closing' : ''}`}
        onClick={() => {
          setClosing(true);
          setTimeout(onClose, 300);
        }}
        role="status"
        aria-live="polite"
      >
        {type === 'bad' && (
          <span className="toast-badge" aria-hidden="true">
            !
          </span>
        )}
        {type === 'good' && (
          <span className="toast-badge" aria-hidden="true">
            ✓
          </span>
        )}
        <span className="toast-copy" dir="auto">
          {localizedMessage}
        </span>
      </div>
    </div>
  );
}
