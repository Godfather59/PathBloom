import React from 'react';
import { AppIcon } from './AppIcon';

export function PhaseTwoScreen({
  icon = 'life',
  eyebrow,
  title,
  subtitle,
  onClose,
  closeLabel = 'Close',
  headerActions,
  children,
  className = '',
  dir = 'ltr',
}) {
  return (
    <div className={`modal-overlay phase-two-overlay ${className}`.trim()}>
      <section className="phase-two-screen" dir={dir}>
        <header className="phase-two-header">
          <div className="phase-two-heading">
            <span className="phase-two-heading-icon" aria-hidden="true">
              <AppIcon name={icon} size={23} />
            </span>
            <div className="phase-two-heading-copy">
              {eyebrow && <span className="phase-two-eyebrow">{eyebrow}</span>}
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
          </div>
          <div className="phase-two-header-actions">
            {headerActions}
            <button type="button" className="phase-two-close" onClick={onClose} aria-label={closeLabel}>
              <AppIcon name="close" size={21} />
            </button>
          </div>
        </header>
        <div className="phase-two-scroll">{children}</div>
      </section>
    </div>
  );
}

export function PhaseTwoTabs({ tabs, activeId, onChange, ariaLabel = 'Sections' }) {
  return (
    <nav className="phase-two-tabs" aria-label={ariaLabel}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={activeId === tab.id ? 'is-active' : ''}
          onClick={() => onChange(tab.id)}
          aria-current={activeId === tab.id ? 'page' : undefined}
        >
          {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count != null && <small>{tab.count}</small>}
        </button>
      ))}
    </nav>
  );
}

export function PhaseTwoMetric({ label, value, hint, tone = 'neutral', icon }) {
  return (
    <div className={`phase-two-metric tone-${tone}`}>
      <div className="phase-two-metric-top">
        {icon && <span aria-hidden="true">{icon}</span>}
        <strong dir="auto">{value}</strong>
      </div>
      <span>{label}</span>
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function PhaseTwoProgress({ label, value, hint, tone = 'growth', inverse = false }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const visualValue = inverse ? 100 - safeValue : safeValue;
  return (
    <div className={`phase-two-progress tone-${tone}`}>
      <div className="phase-two-progress-label">
        <span>{label}</span>
        <strong>{safeValue}%</strong>
      </div>
      <div className="phase-two-progress-track" aria-hidden="true">
        <div style={{ width: `${visualValue}%` }} />
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function PhaseTwoSection({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`phase-two-section ${className}`.trim()}>
      {(title || subtitle || action) && (
        <header className="phase-two-section-heading">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PhaseTwoEmpty({ icon = '✨', title, description, action }) {
  return (
    <div className="phase-two-empty">
      <span aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function PhaseTwoActionRow({
  icon,
  title,
  subtitle,
  meta,
  onClick,
  disabled = false,
  tone = 'neutral',
  trailing,
  selected = false,
}) {
  return (
    <button
      type="button"
      className={`phase-two-action-row tone-${tone} ${selected ? 'is-selected' : ''}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="phase-two-action-icon" aria-hidden="true">{icon}</span>}
      <span className="phase-two-action-copy">
        <strong dir="auto">{title}</strong>
        {subtitle && <small dir="auto">{subtitle}</small>}
        {meta && <span className="phase-two-action-meta">{meta}</span>}
      </span>
      <span className="phase-two-action-trailing">
        {trailing || <AppIcon name="chevron" size={17} />}
      </span>
    </button>
  );
}
