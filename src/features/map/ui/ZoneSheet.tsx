"use client";

import { useRef, useState } from "react";
import type { ZoneWithGeo } from "@/features/map/model/types";
import { ZoneListRow } from "./ZoneListRow";

interface Props {
  zones: ZoneWithGeo[];
  selectedId: string | null;
  height: number;
  min: number;
  max: number;
  onHeightChange: (height: number) => void;
  onDragEnd: () => void;
  onSelectZone: (id: string) => void;
  onLongPressZone: (id: string, x: number, y: number) => void;
}

export function ZoneSheet({
  zones,
  selectedId,
  height,
  min,
  max,
  onHeightChange,
  onDragEnd,
  onSelectZone,
  onLongPressZone,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startY: number; startHeight: number } | null>(null);

  const onGrabPointerDown = (e: React.PointerEvent) => {
    drag.current = { startY: e.clientY, startHeight: height };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onGrabPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.startY;
    let next = drag.current.startHeight - dy;
    if (next < min) next = min - (min - next) * 0.35;
    if (next > max) next = max + (next - max) * 0.35;
    onHeightChange(Math.round(next));
  };

  const onGrabPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    onDragEnd();
  };

  return (
    <div
      className="zone-sheet"
      style={{
        height,
        transition: dragging ? "none" : "height 0.38s var(--bp-ease)",
      }}
    >
      <div
        className="zone-sheet__grab"
        onPointerDown={onGrabPointerDown}
        onPointerMove={onGrabPointerMove}
        onPointerUp={onGrabPointerUp}
        onPointerCancel={onGrabPointerUp}
      >
        <i />
      </div>

      <div className="zone-sheet__scroll">
        <div className="zone-sheet__head">
          <h2>Near you</h2>
          <span>{zones.length} zones</span>
        </div>
        <ul className="zone-list">
          {zones.map((zone) => (
            <ZoneListRow
              key={zone.id}
              zone={zone}
              selected={zone.id === selectedId}
              onSelect={() => onSelectZone(zone.id)}
              onLongPress={(x, y) => onLongPressZone(zone.id, x, y)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
