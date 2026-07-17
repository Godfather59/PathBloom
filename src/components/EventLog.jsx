import React, { useEffect, useRef, memo, useMemo } from 'react';
import { translateGameMessage, translateGameText } from '../logic/i18n';
import { cleanLocalizedText } from '../logic/localizationSanitizer';
import './EventLog.css';

const MAX_VISIBLE_EVENTS = 100;

const localizeEvent = (event, language) => {
  const localized = event.messageKey
    ? translateGameMessage(language, event.messageKey, event.messageParams || {}, event.text)
    : translateGameText(language, event.text);

  return cleanLocalizedText(localized, event.text, language);
};

const EventCard = memo(({ event, language, t }) => (
  <div className={`event-card type-${event.type || 'neutral'}`}>
    <div className="event-text">{localizeEvent(event, language)}</div>
    <span className="event-age-badge">
      {t('common.age', 'Age')} {event.age}
    </span>
  </div>
));

export const EventLog = memo(
  ({ history = [], language = 'en', t = (key, fallback) => fallback || key }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) {
        return;
      }

      const updatePadding = () => {
        const hud = document.querySelector('.hud-container');
        const actionMenu = document.querySelector('.action-menu');
        if (hud) {
          el.style.paddingTop = `${hud.offsetHeight + 8}px`;
        }
        if (actionMenu) {
          el.style.paddingBottom = `${actionMenu.offsetHeight + 8}px`;
        }
      };

      const ro = new ResizeObserver(updatePadding);
      const hud = document.querySelector('.hud-container');
      const actionMenu = document.querySelector('.action-menu');
      if (hud) {
        ro.observe(hud);
      }
      if (actionMenu) {
        ro.observe(actionMenu);
      }
      updatePadding();

      return () => ro.disconnect();
    }, []);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [history]);

    const displayHistory = useMemo(() => {
      const reversed = [...history].reverse();
      return reversed.length > MAX_VISIBLE_EVENTS
        ? reversed.slice(0, MAX_VISIBLE_EVENTS)
        : reversed;
    }, [history]);

    return (
      <div className="event-log" ref={containerRef} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {displayHistory.length === 0 && (
          <div className="event-card type-neutral" style={{ opacity: 0.5, textAlign: 'center' }}>
            <div className="event-text">{t('eventlog.empty', 'No events yet. Start living!')}</div>
          </div>
        )}
        {displayHistory.map((event, index) => (
          <EventCard key={event.id || index} event={event} language={language} t={t} />
        ))}
      </div>
    );
  }
);
