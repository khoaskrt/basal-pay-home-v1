"use client";

import type { ZoneWithGeo } from "@/features/map/model/types";
import { IconArrowUpRight, IconShare, IconWarning } from "@/shared/ui/icons";

interface Props {
  zone: ZoneWithGeo;
  x: number;
  y: number;
  onDismiss: () => void;
  onDirections: () => void;
  onShare: () => void;
  onReport: () => void;
}

export function ZoneContextMenu({ zone, x, y, onDismiss, onDirections, onShare, onReport }: Props) {
  return (
    <>
      <div className="ctx-backdrop" onClick={onDismiss} />
      <div className="ctx-menu" style={{ left: x, top: y }}>
        <div className="ctx-menu__title">{zone.name}</div>
        <button type="button" onClick={onDirections}>
          <IconArrowUpRight size={16} /> Directions
        </button>
        <button type="button" onClick={onShare}>
          <IconShare size={16} /> Share zone
        </button>
        <button type="button" onClick={onReport}>
          <IconWarning size={16} /> Report an issue
        </button>
      </div>
    </>
  );
}
