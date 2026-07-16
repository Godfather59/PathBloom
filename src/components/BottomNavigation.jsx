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
    fast: 'Automatic progression',
    oneStep: 'One step',
    oneMonth: 'One month',
    oneYear: '+1 Year',
    autoYears: 'Auto: 5 Years',
    autoMonths: 'Auto: Up to 12 Months',
    stops: 'Stops for decisions',
  },
  ar: {
    life: 'الحياة',
    activities: 'الأنشطة',
    world: 'العالم',
    menu: 'القائمة',
    fast: 'التقدم التلقائي',
    oneStep: 'خطوة واحدة',
    oneMonth: 'شهر واحد',
    oneYear: 'سنة واحدة',
    autoYears: 'تلقائي: 5 سنوات',
    autoMonths: 'تلقائي: حتى 12 شهرا',
    stops: 'يتوقف عند ظهور قرار',
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
  const locale = language === 'ar' ? 'ar' : 'en';
  const labels = LABELS[locale];
  const firstHalf = DESTINATIONS.slice(0, 2);
  const secondHalf = DESTINATIONS.slice(2);
  const resolvedPrimaryLabel = isMonthly ? primaryLabel : labels.oneYear;
  const primaryCaption = isMonthly ? labels.oneMonth : labels.oneStep;
  const resolvedSmartLabel = isMonthly ? labels.autoMonths : labels.autoYears;

  const renderDestination = destination => (
    <button
      key={destination.id}
      type="button"
      className={`bottom-nav-item ${activeDestination === destination.id ? 'is-active' : ''}`}
      onClick={() => onNavigate?.(destination.id)}
      aria-current={activeDestination === destination.id ? 'page' : undefined}
      aria-label={labels[destination.id]}
      title={labels[destination.id]}
    >
      <span className="bottom-nav-icon">
        <AppIcon name={destination.icon} size={21} />
      </span>
      <span className="bottom-nav-label">{labels[destination.id]}</span>
    </button>
  );

  return (
    <nav className="bottom-navigation" aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
      <div className="bottom-nav-side bottom-nav-start">{firstHalf.map(renderDestination)}</div>

      <div className="time-control-dock">
        <button
          type="button"
          className={`time-primary-action ${isMonthly ? 'is-monthly' : 'is-yearly'}`}
          onClick={onPrimaryAction}
          disabled={disabled}
          title={primaryHint}
          aria-label={`${resolvedPrimaryLabel}. ${primaryCaption}`}
        >
          <span className="time-primary-icon">
            <AppIcon name="clock" size={24} strokeWidth={2} />
          </span>
          <span className="time-primary-label">{resolvedPrimaryLabel}</span>
          <span className="time-primary-caption">{primaryCaption}</span>
        </button>

        <button
          type="button"
          className="time-smart-action"
          onClick={onSmartAdvance}
          disabled={disabled}
          title={`${resolvedSmartLabel} — ${labels.stops}`}
          aria-label={`${labels.fast}: ${resolvedSmartLabel}. ${labels.stops}`}
        >
          <AppIcon name="fast" size={15} />
          <span className="time-smart-copy">
            <strong>{resolvedSmartLabel}</strong>
            <small>{labels.stops}</small>
          </span>
        </button>
      </div>

      <div className="bottom-nav-side bottom-nav-end">{secondHalf.map(renderDestination)}</div>
    </nav>
  );
});
