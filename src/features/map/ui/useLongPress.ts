"use client";

import { useRef } from "react";

const LONG_PRESS_MS = 480;
const MOVE_CANCEL_PX = 8;

function pointFromEvent(e: React.PointerEvent) {
  return { x: e.clientX, y: e.clientY };
}

/** Press-and-hold detection for DOM elements (zone rows), mirroring the map's own long-press. */
export function useLongPress(onLongPress: (x: number, y: number) => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    start.current = null;
  };

  return {
    onPointerDown: (e: React.PointerEvent) => {
      start.current = pointFromEvent(e);
      timer.current = setTimeout(() => {
        if (start.current) onLongPress(start.current.x, start.current.y);
        start.current = null;
      }, LONG_PRESS_MS);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current) return;
      const { x, y } = pointFromEvent(e);
      if (Math.hypot(x - start.current.x, y - start.current.y) > MOVE_CANCEL_PX) clear();
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
  };
}
