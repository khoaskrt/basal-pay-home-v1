"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { HomeScreen } from "@/features/home/ui/HomeScreen";
import { DeviceFrame } from "@/shared/ui/DeviceFrame";
import { ScreenScaler } from "@/shared/ui/ScreenScaler";

// maplibre-gl is only needed once the user opens the Map screen, so it's kept
// out of the initial bundle.
const MapScreen = dynamic(
  () => import("@/features/map/ui/MapScreen").then((mod) => mod.MapScreen),
  { ssr: false },
);

type Screen = "home" | "map";

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mapMounted, setMapMounted] = useState(false);

  const openMap = () => {
    setMapMounted(true);
    setScreen("map");
  };

  return (
    <ScreenScaler>
      <DeviceFrame>
        <div className="app-shell" data-open={screen === "map" ? "map" : undefined}>
          <div className="app-shell__pane app-shell__pane--home">
            <HomeScreen onOpenMap={openMap} />
          </div>
          {mapMounted && (
            <div className="app-shell__pane app-shell__pane--map">
              <MapScreen onBack={() => setScreen("home")} />
            </div>
          )}
        </div>
      </DeviceFrame>
    </ScreenScaler>
  );
}
