import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ---------------------------------------------------------------- navigation */

export function IconHome({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 3.28c.6 0 1.15.2 1.6.56l6.3 5.06c.55.44.82 1.05.82 1.7v7.67c0 1.35-1.1 2.45-2.45 2.45h-3.82v-4.05a2.45 2.45 0 0 0-4.9 0v4.05H5.73a2.45 2.45 0 0 1-2.45-2.45V10.6c0-.65.27-1.26.82-1.7l6.3-5.06c.45-.36 1-.56 1.6-.56Z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function IconWallet({ size = 36, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path
        d="M2.7 12h18.6"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconPerson({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <circle
        cx="12"
        cy="6.05"
        r="2.95"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5.9 20.8c0-4.7 2.7-7.7 6.1-7.7s6.1 3 6.1 7.7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* -------------------------------------------------------------------- arrows */

export function IconArrowDownLeft({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M16.5 7.5 7.5 16.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M7.5 10.4v6.1h6.1"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconArrowUpRight({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M7.5 16.5 16.5 7.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M16.5 13.6V7.5h-6.1"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconDepositCircle({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="12" cy="12" r="9.4" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M15.4 8.6 9.3 14.7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M9.3 11.3v3.4h3.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconSendCircle({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="12" cy="12" r="9.4" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M8.6 15.4 14.7 9.3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M14.7 12.7V9.3h-3.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconChevronRight({ size = 16, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="m8.5 5 7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconChevronLeft({ size = 16, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="m15.5 5-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ----------------------------------------------------------------- controls */

export function IconBell({ size = 21, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 3.1a5.6 5.6 0 0 0-5.6 5.6v3.1l-1.2 2.6a1 1 0 0 0 .9 1.44h11.8a1 1 0 0 0 .9-1.44l-1.2-2.6V8.7A5.6 5.6 0 0 0 12 3.1Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinejoin="round"
      />
      <path
        d="M9.8 18.9a2.3 2.3 0 0 0 4.4 0"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconEye({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 5.4c4.5 0 8.1 3.1 9.5 6.1a.9.9 0 0 1 0 .9c-1.4 3-5 6.2-9.5 6.2S4 15.4 2.5 12.4a.9.9 0 0 1 0-.9C4 8.5 7.5 5.4 12 5.4Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.9" />
    </Svg>
  );
}

export function IconEyeOff({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 5.4c4.5 0 8.1 3.1 9.5 6.1a.9.9 0 0 1 0 .9 13 13 0 0 1-2.2 2.9"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6 6.9A13 13 0 0 0 2.5 11.5a.9.9 0 0 0 0 .9c1.4 3 5 6.2 9.5 6.2 1.7 0 3.3-.5 4.6-1.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M3.6 3.6 20.4 20.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconClose({ size = 16, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* ------------------------------------------------------------ modal actions */

export function IconQr({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M3.5 9V5.6c0-1.2.9-2.1 2.1-2.1H9M15 3.5h3.4c1.2 0 2.1.9 2.1 2.1V9M20.5 15v3.4c0 1.2-.9 2.1-2.1 2.1H15M9 20.5H5.6c-1.2 0-2.1-.9-2.1-2.1V15"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M3.5 12h17"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconPlusCircle({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M12 8.2v7.6M8.2 12h7.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconBank({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M3.2 9.4 12 4l8.8 5.4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.6 10.6v7M10 10.6v7M14 10.6v7M18.4 10.6v7M3 20.4h18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconSwap({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M4 8h13l-3.2-3.2M20 16H7l3.2 3.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconShield({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 3.2 5 5.9v5.4c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V5.9L12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconClock({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M12 7v5.3l3.4 2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconCheck({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="m5.5 12.5 4.2 4.2 8.8-9.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* --------------------------------------------------------------- utilities */

export function IconMap({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 20.5c3.3-3.4 6-6.5 6-9.7a6 6 0 1 0-12 0c0 3.2 2.7 6.3 6 9.7Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.8" r="2.4" stroke="currentColor" strokeWidth="1.9" />
    </Svg>
  );
}

export function IconEsim({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M9 4v2.5A1.5 1.5 0 0 0 10.5 8h3A1.5 1.5 0 0 0 15 6.5V4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 13.4h7.6M8.2 16.6h5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconFlight({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconTour({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <rect
        x="5"
        y="7.5"
        width="14"
        height="11.5"
        rx="2.8"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path
        d="M9 7.5V6a2.5 2.5 0 0 1 2.5-2.5h1A2.5 2.5 0 0 1 15 6v1.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path d="M9 12.5h6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

/* ------------------------------------------------------------------- map */

export function IconLocationPin({ size = 22, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 21c4-4.2 6.5-7.8 6.5-11A6.5 6.5 0 0 0 5.5 10c0 3.2 2.5 6.8 6.5 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  );
}

export function IconLockOpen({ size = 14, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <rect x="5" y="11" width="14" height="9" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 11V7.5a4 4 0 0 1 7.6-1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconLockClosed({ size = 14, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <rect x="5" y="11" width="14" height="9" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 11V7.5a4 4 0 0 1 8 0V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconShare({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8.2 10.8 15.8 7.2M8.2 13.2l7.6 3.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconWarning({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M10.6 4.3 3.4 17a1.8 1.8 0 0 0 1.55 2.7h14.1A1.8 1.8 0 0 0 20.6 17L13.4 4.3a1.8 1.8 0 0 0-3.1 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 10v3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="1" fill="currentColor" />
    </Svg>
  );
}

export function IconCoffee({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M6 8.5v6.2a3 3 0 0 0 3 3h2.5a3 3 0 0 0 3-3V8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5h2a2 2 0 0 1 0 4h-1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 5.3v1.6M11 5.3v1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}

export function IconBag({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M5.8 8.3h12.4l-.9 10.1a2 2 0 0 1-2 1.8H8.7a2 2 0 0 1-2-1.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.3V6.7a3 3 0 0 1 6 0v1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconBed({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M4 18.5V7.5M4 12.5h16v6M20 18.5v-6.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8.4" cy="9.6" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M11.6 12.5c.4-1.5 1.7-2.5 3.4-2.5h2.2a2.4 2.4 0 0 1 2.4 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconGolfFlag({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path d="M9.5 19.6V4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M9.5 4.6 16.5 8l-7 3.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <ellipse cx="9.5" cy="20" rx="4.4" ry="1.3" stroke="currentColor" strokeWidth="1.4" />
    </Svg>
  );
}

export function IconLayers({ size = 18, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <path
        d="M12 3.5 20 7.5 12 11.5 4 7.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m4 12 8 4 8-4M4 16.5l8 4 8-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconEmptyState({ size = 26, ...rest }: IconProps) {
  return (
    <Svg size={size} {...rest}>
      <rect x="4" y="5.5" width="16" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 10.5h8M8 14h4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2.6 2.6"
      />
    </Svg>
  );
}

/* -------------------------------------------------------------- status bar */

export function StatusCellular(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true" {...props}>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={i * 5.4}
          y={9 - i * 2.6}
          width="3.6"
          height={3 + i * 2.6}
          rx="1.05"
          fill="currentColor"
          opacity={i === 3 ? 0.38 : 1}
        />
      ))}
    </svg>
  );
}

export function StatusWifi(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1.2 4.05a11.1 11.1 0 0 1 14.6 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M3.9 6.9a7.1 7.1 0 0 1 9.2 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M6.55 9.6a3.2 3.2 0 0 1 3.9 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StatusBattery(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="30" height="13" viewBox="0 0 30 13" fill="none" aria-hidden="true" {...props}>
      <rect
        x="0.7"
        y="0.7"
        width="25.6"
        height="11.6"
        rx="3.6"
        stroke="currentColor"
        strokeOpacity="0.36"
        strokeWidth="1.2"
      />
      <rect x="2.4" y="2.4" width="22.2" height="8.2" rx="2.4" fill="currentColor" />
      <path
        d="M28.2 4.6v3.8c.9-.33 1.5-1 1.5-1.9s-.6-1.57-1.5-1.9Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}
