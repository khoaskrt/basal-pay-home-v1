"use client";

import { GROUPS } from "@/features/map/fixtures/zones";
import type { ZoneGroupId, ZoneWithGeo } from "@/features/map/model/types";
import { IconChevronLeft, IconLockClosed, IconLockOpen } from "@/shared/ui/icons";

const FILTERS: Array<{ id: ZoneGroupId | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "area", label: GROUPS.area.label },
  { id: "airport", label: GROUPS.airport.label },
  { id: "resort", label: GROUPS.resort.label },
];

interface Props {
  compact: boolean;
  inZone: boolean;
  filter: ZoneGroupId | "all";
  zones: ZoneWithGeo[];
  onBack: () => void;
  onFilterChange: (filter: ZoneGroupId | "all") => void;
}

export function MapHeader({ compact, inZone, filter, zones, onBack, onFilterChange }: Props) {
  return (
    <div className={`map-header${compact ? " map-header--compact" : ""}`}>
      <div className="map-header__row">
        <button type="button" className="map-header__circle" onClick={onBack} aria-label="Back">
          <IconChevronLeft size={22} />
        </button>
        <h1 className="map-header__title">Authorized Payment Zones</h1>
        <span className={`zone-pill${inZone ? "" : " zone-pill--out"}`}>
          {inZone ? <IconLockOpen size={12} /> : <IconLockClosed size={12} />}
          {inZone ? "In zone" : "Out of zone"}
        </span>
      </div>

      <div className="map-header__chips">
        {FILTERS.map((option) => {
          const count =
            option.id === "all"
              ? zones.length
              : zones.filter((zone) => zone.group === option.id).length;
          return (
            <button
              key={option.id}
              type="button"
              className={`chip${filter === option.id ? " chip--on" : ""}`}
              onClick={() => onFilterChange(option.id)}
            >
              {option.label} <b>{count}</b>
            </button>
          );
        })}
      </div>
    </div>
  );
}
