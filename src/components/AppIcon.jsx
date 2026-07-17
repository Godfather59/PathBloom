import React from 'react';

const ICONS = {
  life: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
  ),
  health: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
  ),
  happiness: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 10h.01M15.5 10h.01M8 14.5c1.1 1.3 2.4 2 4 2s2.9-.7 4-2" />
    </>
  ),
  stress: (
    <>
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v5M12 17.2v.1" />
    </>
  ),
  smarts: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M8.2 14.5A6 6 0 1 1 15.8 14.5c-.8.7-1.3 1.4-1.4 2.5h-4.8c-.1-1.1-.6-1.8-1.4-2.5Z" />
    </>
  ),
  looks: (
    <>
      <path d="m12 3 1.6 4.2L18 9l-4.4 1.8L12 15l-1.6-4.2L6 9l4.4-1.8L12 3Z" />
      <path d="m18.5 14 .8 2.1 2.2.9-2.2.9-.8 2.1-.8-2.1-2.2-.9 2.2-.9.8-2.1Z" />
    </>
  ),
  karma: (
    <>
      <path d="M12 4v16M5 7h14" />
      <path d="m5 7-3 6h6L5 7Zm14 0-3 6h6l-3-6ZM8 20h8" />
    </>
  ),
  energy: <path d="m13 2-8 12h6l-1 8 9-13h-6V2Z" />,
  fame: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
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
  more: (
    <>
      <circle cx="5" cy="12" r="1.4" className="icon-fill" />
      <circle cx="12" cy="12" r="1.4" className="icon-fill" />
      <circle cx="19" cy="12" r="1.4" className="icon-fill" />
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
  favorite: (
    <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
  ),
  recent: (
    <>
      <path d="M4 5v5h5M4.8 9A8 8 0 1 1 6 17.7" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  identity: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.5-5 3.1-7.5 8-7.5S19.5 16 20 21" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6V21H10v-.1A1.8 1.8 0 0 0 8.9 19.3a1.8 1.8 0 0 0-2 .4l-.1.1L4 17l.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 3 13.9H3V10h.1a1.8 1.8 0 0 0 1.6-1.1 1.8 1.8 0 0 0-.4-2L4.2 6.8 7 4l.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 10.1 3H14a1.8 1.8 0 0 0 1.1 1.5 1.8 1.8 0 0 0 2-.4l.1-.1L20 6.8l-.1.1a1.8 1.8 0 0 0-.4 2A1.8 1.8 0 0 0 21 10h.1v3.9H21A1.8 1.8 0 0 0 19.4 15Z" />
    </>
  ),
  random: (
    <>
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  back: <path d="m15 18-6-6 6-6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m5 12 4 4L19 6" />,
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
