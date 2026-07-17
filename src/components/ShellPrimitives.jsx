import React, { useEffect, useId, useRef } from 'react';
import { AppIcon } from './AppIcon';

export function Screen({ children, className = '', dir, labelledBy }) {
  return (
    <section
      className={`pb-screen ${className}`.trim()}
      dir={dir}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  );
}

export function TopBar({ title, subtitle, leading, actions, className = '' }) {
  return (
    <header className={`pb-top-bar ${className}`.trim()}>
      {leading && <div className="pb-top-bar-leading">{leading}</div>}
      <div className="pb-top-bar-copy">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="pb-top-bar-actions">{actions}</div>}
    </header>
  );
}

export function Card({ children, className = '', as: Component = 'div' }) {
  return <Component className={`pb-card ${className}`.trim()}>{children}</Component>;
}

export function IconButton({ label, icon, children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`pb-icon-button ${className}`.trim()}
      aria-label={label}
      title={label}
      {...props}
    >
      {children || <AppIcon name={icon} size={21} />}
    </button>
  );
}

export function ListItem({
  icon,
  title,
  subtitle,
  meta,
  onClick,
  disabled = false,
  selected = false,
  trailing,
  className = '',
}) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      type={onClick ? 'button' : undefined}
      className={`pb-list-item ${selected ? 'is-selected' : ''} ${className}`.trim()}
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
    >
      {icon && <span className="pb-list-item-icon">{icon}</span>}
      <span className="pb-list-item-copy">
        <strong>{title}</strong>
        {subtitle && <small>{subtitle}</small>}
      </span>
      {meta && <span className="pb-list-item-meta">{meta}</span>}
      {trailing}
    </Component>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  closeLabel = 'Close',
  className = '',
}) {
  const titleId = useId();
  const sheetRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleBack = event => {
      event.preventDefault();
      onClose?.();
    };
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener('capacitor-back', handleBack);
    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => sheetRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('capacitor-back', handleBack);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="pb-sheet-layer" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) {
        onClose?.();
      }
    }}>
      <section
        ref={sheetRef}
        className={`pb-bottom-sheet ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="pb-sheet-handle" aria-hidden="true" />
        <header className="pb-sheet-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <IconButton label={closeLabel} icon="close" onClick={onClose} />
        </header>
        <div className="pb-sheet-body">{children}</div>
        {footer && <footer className="pb-sheet-footer">{footer}</footer>}
      </section>
    </div>
  );
}

export function ConfirmSheet({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  warning,
}) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      subtitle={description}
      footer={
        <div className="pb-sheet-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      {warning && <div className="pb-confirm-warning"><AppIcon name="warning" size={22} />{warning}</div>}
    </BottomSheet>
  );
}
