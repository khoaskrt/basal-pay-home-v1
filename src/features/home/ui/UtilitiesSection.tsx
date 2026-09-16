"use client";

import { UTILITIES } from "@/features/home/fixtures/home";
import type { UtilityId } from "@/features/home/model/types";
import { IconEsim, IconFlight, IconMap, IconTour } from "@/shared/ui/icons";

function UtilityIcon({ id, size = 27 }: { id: UtilityId; size?: number }) {
  switch (id) {
    case "map":
      return <IconMap size={size} />;
    case "esim":
      return <IconEsim size={size} />;
    case "flights":
      return <IconFlight size={size} />;
    case "tours":
      return <IconTour size={size} />;
  }
}

interface Props {
  onSelect?: (id: UtilityId) => void;
}

export function UtilitiesSection({ onSelect }: Props = {}) {
  return (
    <section className="utilities" aria-label="Utilities">
      <h2 className="utilities__title">Utilities</h2>

      <ul className="utilities__grid">
        {UTILITIES.map((utility) => {
          const tappable = !utility.soon && !!onSelect;
          return (
            <li
              key={utility.id}
              className={`util util--${utility.id}${utility.soon ? " util--soon" : ""}`}
              {...(tappable
                ? {
                    role: "button",
                    tabIndex: 0,
                    onClick: () => onSelect(utility.id),
                    onKeyDown: (event: React.KeyboardEvent) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(utility.id);
                      }
                    },
                  }
                : {})}
            >
              <span className="util__tile">
                {utility.soon && <span className="util__badge">Coming soon</span>}
                <UtilityIcon id={utility.id} />
              </span>
              <span className="util__label">{utility.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
