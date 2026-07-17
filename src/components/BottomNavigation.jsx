import React, { memo, useState } from 'react';
import { AppIcon } from './AppIcon';
import { ConfirmSheet } from './ShellPrimitives';

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
    ageUp: 'Age Up',
    oneMonth: 'One month',
    oneYear: 'One year',
    moreTime: 'More time controls',
    smartYears: 'Smart +5',
    smartMonths: 'Smart +12',
    confirmTitle: 'Advance automatically?',
    confirmYears: 'This can move the story forward by up to five years.',
    confirmMonths: 'This can move the active situation forward by up to twelve months.',
    warning:
      'Automatic progression stops for decisions, but several events can happen before it stops.',
    confirm: 'Advance',
    cancel: 'Cancel',
  },
  ar: {
    life: 'الحياة',
    activities: 'الأنشطة',
    world: 'العالم',
    menu: 'القائمة',
    ageUp: 'تقدم سنة',
    oneMonth: 'شهر واحد',
    oneYear: 'سنة واحدة',
    moreTime: 'المزيد من أدوات الوقت',
    smartYears: 'ذكي +5',
    smartMonths: 'ذكي +12',
    confirmTitle: 'هل تريد التقدم تلقائيا؟',
    confirmYears: 'قد تتقدم القصة حتى خمس سنوات.',
    confirmMonths: 'قد يتقدم الوضع النشط حتى اثني عشر شهرا.',
    warning: 'يتوقف التقدم التلقائي عند القرارات، لكن قد تقع عدة أحداث قبل التوقف.',
    confirm: 'تقدم',
    cancel: 'إلغاء',
  },
};

export const BottomNavigation = memo(
  ({
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
  }) => {
    const [smartConfirmOpen, setSmartConfirmOpen] = useState(false);
    const locale = language === 'ar' ? 'ar' : 'en';
    const labels = LABELS[locale];
    const firstHalf = DESTINATIONS.slice(0, 2);
    const secondHalf = DESTINATIONS.slice(2);
    const resolvedPrimaryLabel = primaryLabel || labels.ageUp;
    const primaryCaption = isMonthly ? labels.oneMonth : labels.oneYear;
    const resolvedSmartLabel = smartLabel || (isMonthly ? labels.smartMonths : labels.smartYears);

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
      <>
        <nav
          className="bottom-navigation"
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
        >
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
              className="time-more-action"
              onClick={() => setSmartConfirmOpen(true)}
              disabled={disabled}
              title={`${labels.moreTime}: ${resolvedSmartLabel}`}
              aria-label={`${labels.moreTime}: ${resolvedSmartLabel}`}
              aria-haspopup="dialog"
            >
              <AppIcon name="more" size={20} />
            </button>
          </div>

          <div className="bottom-nav-side bottom-nav-end">{secondHalf.map(renderDestination)}</div>
        </nav>

        <ConfirmSheet
          open={smartConfirmOpen}
          onClose={() => setSmartConfirmOpen(false)}
          onConfirm={onSmartAdvance}
          title={labels.confirmTitle}
          description={isMonthly ? labels.confirmMonths : labels.confirmYears}
          warning={`${resolvedSmartLabel} — ${labels.warning}`}
          confirmLabel={labels.confirm}
          cancelLabel={labels.cancel}
        />
      </>
    );
  }
);
