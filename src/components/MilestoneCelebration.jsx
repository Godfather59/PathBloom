import React, { useEffect } from 'react';
import './ReleasePolish.css';

export function MilestoneCelebration({ notification, onClose, language = 'en' }) {
  useEffect(() => {
    if (!notification) {
      return undefined;
    }
    const timeout = setTimeout(onClose, notification.type === 'goal' ? 4200 : 3600);
    return () => clearTimeout(timeout);
  }, [notification, onClose]);

  if (!notification) {
    return null;
  }
  const isArabic = language === 'ar';
  const label =
    notification.type === 'goal'
      ? isArabic
        ? 'إنجاز جديد'
        : 'New milestone'
      : isArabic
        ? 'ميزة جديدة'
        : 'Feature unlocked';

  return (
    <div
      className="milestone-celebration"
      dir={isArabic ? 'rtl' : 'ltr'}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        className="milestone-celebration-card"
        onClick={onClose}
        aria-label={isArabic ? 'أغلق الإشعار' : 'Dismiss notification'}
      >
        <span className="milestone-burst" aria-hidden="true" />
        <span className="milestone-icon" aria-hidden="true">
          {notification.icon || '✨'}
        </span>
        <span className="milestone-copy">
          <small>{label}</small>
          <strong>{notification.title}</strong>
          <span>{notification.body}</span>
          {notification.reward && <em>🎁 {notification.reward}</em>}
        </span>
      </button>
    </div>
  );
}

export default MilestoneCelebration;
