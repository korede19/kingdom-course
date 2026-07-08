type IconName =
  | "shield"
  | "mail"
  | "lock"
  | "user"
  | "grid"
  | "book"
  | "certificate"
  | "cart"
  | "heart"
  | "logout"
  | "check"
  | "clock"
  | "star"
  | "compass"
  | "building"
  | "chevronLeft"
  | "menu"
  | "close"
  | "eye"
  | "eyeOff";

const PATHS: Record<IconName, React.ReactNode> = {
  shield: (
    <path
      d="M12 2L3 6V11C3 16.5 6.8 21.2 12 22.5C17.2 21.2 21 16.5 21 11V6L12 2Z"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.7" />
      <path d="M4 6.5l8 6 8-6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" strokeWidth="1.7" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" strokeWidth="1.7" />
      <path d="M4.5 20c1.4-4 4.2-6 7.5-6s6.1 2 7.5 6" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" strokeWidth="1.8" />
    </>
  ),
  book: (
    <>
      <path d="M9 4L3 6.5v14L9 18l6 2.5 6-2.5v-14L15 6.5 9 4z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4v14M15 6.5v14" strokeWidth="1.8" />
    </>
  ),
  certificate: (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4z" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M7 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4M17 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M12 13v3m-3 4h6m-3 0v-4" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  cart: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  heart: (
    <path
      d="M12 20.5c-4-3-8.5-6.5-8.5-11.2A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.5 2.9c0 4.7-4.5 8.2-8.5 11.2z"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  ),
  logout: (
    <>
      <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
      <path d="M12 7v5l3.5 2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  star: (
    <path
      d="M12 2.5l2.9 6.06 6.6.83-4.85 4.66 1.28 6.6L12 17.6l-5.93 3.05 1.28-6.6L2.5 9.39l6.6-.83L12 2.5z"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
      <path d="M15 9l-2 5-5 2 2-5 5-2z" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  building: (
    <path
      d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-6h4v6"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  chevronLeft: <path d="M15 5l-7 7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.8" strokeLinecap="round" />,
  close: <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.8" strokeLinecap="round" />,
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.7" />
    </>
  ),
  eyeOff: (
    <>
      <path
        d="M3 3l18 18M10.6 5.2C11 5.1 11.5 5 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.1M6.5 6.6A17.9 17.9 0 0 0 2 12s3.6 7 10 7c1.4 0 2.7-.3 3.8-.8"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 10a3 3 0 0 0 4.2 4.2" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
} & Omit<React.SVGProps<SVGSVGElement>, "name" | "color">;

export function Icon({ name, size = 18, color = "currentColor", ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...rest}>
      {PATHS[name]}
    </svg>
  );
}
