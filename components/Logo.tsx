import { useId } from "react";

/**
 * Kingdom Culture Academy mark: a heavy, free-standing K, cut flat top and
 * bottom, wearing a three-point crown. Colour comes from `color`.
 */
export function LogoMark({
  size = 32,
  color = "currentColor",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const clipId = `${useId()}-c`;
  return (
    <svg
      width={Math.round(size * 0.88)}
      height={size}
      viewBox="7.5 0.5 36 41"
      className={className}
      role="img"
      aria-label="Kingdom Culture Academy"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="12" width="48" height="28" />
        </clipPath>
      </defs>
      <path d="M13 8.5V3L19 6.2L25 1.5L31 6.2L37 3V8.5Z" fill={color} />
      <g fill="none" stroke={color} clipPath={`url(#${clipId})`}>
        <path d="M16.5 10V42" strokeWidth="8" />
        <path d="M20 26.5L34.5 10" strokeWidth="7.5" />
        <path d="M23.5 24.5L35 42" strokeWidth="7.5" />
      </g>
    </svg>
  );
}
