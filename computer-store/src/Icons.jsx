const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

const paths = {
  laptops: <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></>,
  desktops: <><rect x="6" y="3" width="12" height="18" rx="2" /><circle cx="12" cy="15" r="2" /><path d="M9 7h6" /></>,
  gpu: <><rect x="2" y="7" width="20" height="9" rx="1.5" /><circle cx="8" cy="11.5" r="2.5" /><circle cx="15" cy="11.5" r="2.5" /><path d="M5 19v-3M9 19v-3" /></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
  monitors: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></>,
  storage: <><rect x="4" y="9" width="16" height="6" rx="1.5" /><path d="M7 12h.01M10 12h.01M15 12h2" /></>,
  peripherals: <><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 11h.01M10 11h.01M13 11h.01M17 11h.01M8 14h8" /></>,
  motherboards: <><rect x="4" y="4" width="16" height="16" rx="1.5" /><rect x="7" y="7" width="5" height="5" /><path d="M15 7v5M7 16h10" /></>,
  ram: <><rect x="2" y="8" width="20" height="8" rx="1" /><path d="M6 8v8M10 8v8M14 8v8M18 8v8M5 16v3M9 16v3M13 16v3M17 16v3" /></>,
  psu: <><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="9" cy="12" r="3" /><path d="M15 10h3M15 14h3" /></>,
  cases: <><rect x="6" y="3" width="12" height="18" rx="1.5" /><path d="M9 7h6M9 10h6M9 17h6" /></>,
  cooling: <><circle cx="12" cy="12" r="9" /><path d="M12 12c0-4 2-5 4-4-1 2-2 3-4 4zM12 12c4 0 5 2 4 4-2-1-3-2-4-4zM12 12c0 4-2 5-4 4 1-2 2-3 4-4zM12 12c-4 0-5-2-4-4 2 1 3 2 4 4z" /></>,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>,
  cart: <><path d="M3 4h2l2.2 10.2a1 1 0 001 .8h8.6a1 1 0 001-.8L19 8H6" /><circle cx="9.5" cy="19" r="1.2" /><circle cx="16.5" cy="19" r="1.2" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.2-4.2" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor" stroke="none" />,
  truck: <><path d="M2 6h12v10H2zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.7" /><circle cx="17" cy="17.5" r="1.7" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 005 5l-9.4 9.4a2.1 2.1 0 01-3-3l9.4-9.4a4 4 0 00-2-2z" />,
  headset: <><path d="M4 14v-2a8 8 0 0116 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" />,
  scale: <><path d="M12 4v16M6 20h12M4 8h16" /><path d="M7 8l-3 7a3 3 0 006 0zM17 8l-3 7a3 3 0 006 0z" /></>,
  heart: <path d="M12 20.5S3.5 15.4 3.5 9.4A4.6 4.6 0 0112 7a4.6 4.6 0 018.5 2.4c0 6-8.5 11.1-8.5 11.1z" />,
  sliders: <path d="M4 7h9M17 7h3M4 17h3M11 17h9M13 4v6M7 14v6" />,
  menu: <path d="M4 8h16M4 16h16" />,
  back: <path d="M15 5l-7 7 7 7" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
}

export default function Icon({ name, size = 22, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...p} {...rest}>
      {paths[name]}
    </svg>
  )
}
