import type { ReactNode } from "react";

/**
 * Decorative iPhone Pro Max chrome (bezel + Dynamic Island) around the app's
 * 393×852 canvas. Purely presentational — collapses to full-bleed below the
 * `.frame`/`.frame__island` breakpoint defined in device.css, so real phones
 * still get an undecorated screen.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="frame">
      <div className="frame__screen">
        {children}
        <div className="frame__island" />
      </div>
    </div>
  );
}
