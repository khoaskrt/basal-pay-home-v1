"use client";

import { GROUPS } from "@/features/map/fixtures/zones";
import { formatDistance } from "@/features/map/model/geo";
import type { ZoneWithGeo } from "@/features/map/model/types";
import { IconGolfFlag, IconLayers, IconLocationPin } from "@/shared/ui/icons";
import { useLongPress } from "./useLongPress";

function GroupIcon({ group }: { group: ZoneWithGeo["group"] }) {
  if (group === "airport") return <IconLocationPin size={17} />;
  if (group === "resort") return <IconGolfFlag size={17} />;
  return <IconLayers size={17} />;
}

interface Props {
  zone: ZoneWithGeo;
  selected?: boolean;
  onSelect: () => void;
  onLongPress: (x: number, y: number) => void;
}

export function ZoneListRow({ zone, selected, onSelect, onLongPress }: Props) {
  const longPress = useLongPress(onLongPress);

  return (
    <li>
      <button
        type="button"
        className={`zone-row${selected ? " zone-row--selected" : ""}`}
        onClick={onSelect}
        {...longPress}
      >
        <span className={`zone-row__icon${zone.here ? " zone-row__icon--here" : ""}`}>
          <GroupIcon group={zone.group} />
        </span>
        <span className="zone-row__body">
          <span className="zone-row__name">{zone.name}</span>
          <span className="zone-row__meta">
            {zone.here ? (
              <span className="zone-row__here">You are here</span>
            ) : (
              <span>{formatDistance(zone.km)} away</span>
            )}
            <span className="zone-row__dot" />
            <span>{GROUPS[zone.group].label}</span>
          </span>
        </span>
      </button>
    </li>
  );
}
