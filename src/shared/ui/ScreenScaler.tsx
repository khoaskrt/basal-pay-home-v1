"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Mirrors --bp-frame-bezel in globals.css — kept in sync by hand, same as
// the 393/852 canvas size below.
const FRAME_BEZEL = 14;

/**
 * The Home screen is authored against a fixed 393×852 (iPhone 14 Pro) canvas so
 * every value in globals.css can be the number from the Figma frame. This wrapper
 * scales the whole framed device down when the viewport is smaller, so it still
 * fits a laptop window or a short phone without any of the geometry drifting.
 */
export function ScreenScaler({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const fit = () => {
      const framed =
        window.innerWidth >= 480 && window.innerHeight >= 600;
      const pad = framed ? 80 : 0;
      const frameW = 393 + FRAME_BEZEL * 2;
      const frameH = 852 + FRAME_BEZEL * 2;
      const scale = Math.min(
        1,
        (window.innerWidth - pad) / frameW,
        (window.innerHeight - pad) / frameH,
      );
      root.style.setProperty("--bp-scale", String(Math.max(0.4, scale)));
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div ref={ref} className="stage">
      {children}
    </div>
  );
}
