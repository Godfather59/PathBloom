import React from 'react';

const ICONS = {
  life: (
    <path d="M12 21s-7-4.35-9.33-8.12C.78 9.82 2.12 6 5.72 5.35A5.2 5.2 0 0 1 12 8.16a5.2 5.2 0 0 1 6.28-2.81c3.6.65 4.94 4.47 3.05 7.53C19 16.65 12 21 12 21Z" />
  ),
  activities: (
    <>
      <path d="M5 3v4M3 5h4M18 15v6M15 18h6M15.5 3.5l1 2 2 .8-2 1-1 2-1-2-2-1 2-.8 1-2ZM8.5 11.5l1.4 2.8 2.9 1.2-2.9 1.2-1.4 2.8-1.4-2.8-2.9-1.2 2.9-1.2 1.4-2.8Z" />
    </>
  ),
  world: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9h17M3.5 15h17M12 3c2.2 2.5 3.2 5.5 3.2 9S14.2 18.5 12 21M12 3C9.8 5.5 8.8 8.5 8.8 12s1 6.5 3.2 9" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="9" cy="6" r="1.5" className="icon-fill" />
      <circle cx="15" cy="12" r="1.5" className="icon-fill" />
      <circle cx="11" cy="18" r="1.5" className="icon-fill" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  fast: <path d="m5 5 7 7-7 7V5Zm8 0 7 7-7 7V5Z" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18M10 12v2h4v-2" />
    </>
  ),
  relationships: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M2.5 20c.3-4.1 2.2-6 5.5-6s5.2 1.9 5.5 6M13.5 15.2c1-.8 2.2-1.2 3.5-1.2 2.8 0 4.3 1.7 4.5 5" />
    </>
  ),
  education: (
    <>
      <path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z" />
      <path d="M6 11.5V16c3.7 2.6 8.3 2.6 12 0v-4.5M21.5 9v6" />
    </>
  ),
  assets: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  news: (
    <>
      <path d="M5 4h14v16H5z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  trend: <path d="m4 17 5-5 4 3 7-8M15 7h5v5" />,
  warning: (
    <>
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v5M12 17.2v.1" />
    </>
  ),
};

export function AppIcon({ name, size = 22, className = '', strokeWidth = 1.8 }) {
  return (
    <svg
      className={`app-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name] || ICONS.life}
    </svg>
  );
}
