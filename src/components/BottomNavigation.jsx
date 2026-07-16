import React, { memo } from 'react';
import { AppIcon } from './AppIcon';

const DESTINATIONS = [
  { id: 'life', icon: 'life' },
  { id: 'activities', icon: 'activities' },
  { id: 'world', icon: 'world' },
  { id: 'menu', icon: 'menu' },
];

const LABELS = {
  en: {
    life: 'Life',
    activities: 'Activities',
    world: 'World',
    menu: 'Menu',
    fast: 'Fast forward',
  },
  ar: {
    life: 'الحياة',
    activities: 'الأنشطة',
    world: 'العالم',
    menu: 'القائمة',
    fast: 'تقدم سريع',
  },
};

export const BottomNavigation = memo(function BottomNavigation({
  activeDestination = 'life',
  onNavigate,
  onPrimaryAction,
  onSmartAdvance,
  primaryLabel,
  primaryHint,
  smartLabel,
  isMonthly = false,
  disabled = false,
  language = 'en',
}) {
  const labels = LABELS[language === 'ar' ? 'ar' : 'en'];
  const firstHalf = DESTINATIONS.slice(0, 2);
  const secondHalf = DESTINATIONS.slice(2);

  const renderDestination = destination => (
    <button
      key={destination.id}
      type="button"
      className={`bottom-nav-item ${activeDestination === destination.id ? 'is-active' : ''}`}
      onClick={() => onNavigate?.(destination.id)}
      aria-current={activeDestination === destination.id ? 'page' : undefined}
      aria-label={labels[destination.id]}
    >
      <span className="bottom-nav-icon">
        <AppIcon name={destination.icon} size={21} />
      </span>
      <span className="bottom-nav-label">{labels[destination.id]}</span>
    </button>
  );

  return (
    <nav className="bottom-navigation" aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
      <div className="bottom-nav-side bottom-nav-start">{firstHalf.map(renderDestination)}</div>

      <div className="time-control-dock">
        <button
          type="button"
          className={`time-primary-action ${isMonthly ? 'is-monthly' : 'is-yearly'}`}
          onClick={onPrimaryAction}
          disabled={disabled}
          title={primaryHint}
          aria-label={primaryHint || primaryLabel}
        >
          <span className="time-primary-icon">
            <AppIcon name="clock" size={24} strokeWidth={2} />
          </span>
          <span className="time-primary-label">{primaryLabel}</span>
        </button>

        <button
          type="button"
          className="time-smart-action"
          onClick={onSmartAdvance}
          disabled={disabled}
          title={labels.fast}
          aria-label={`${labels.fast}: ${smartLabel}`}
        >
          <AppIcon name="fast" size={14} />
          <span>{smartLabel}</span>
        </button>
      </div>

      <div className="bottom-nav-side bottom-nav-end">{secondHalf.map(renderDestination)}</div>
    </nav>
  );
});
