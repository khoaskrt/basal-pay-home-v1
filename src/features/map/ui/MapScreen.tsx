"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { USER, ZONES } from "@/features/map/fixtures/zones";
import { withGeo } from "@/features/map/model/geo";
import type { ZoneGroupId } from "@/features/map/model/types";
import { IconLocationPin } from "@/shared/ui/icons";
import { MapHeader } from "./MapHeader";
import { ZoneContextMenu } from "./ZoneContextMenu";
import { ZoneSheet } from "./ZoneSheet";
import { useZoneMap } from "./useZoneMap";

const SCREEN_H = 852;
const COLLAPSED_SHEET_H = 262;
const EXPANDED_SHEET_H = Math.round(SCREEN_H * 0.82);
const LOCATE_HIDE_ABOVE = SCREEN_H - 210;
const HEADER_COMPACT_ABOVE = SCREEN_H * 0.55;
const MENU_W = 200;
const MENU_H = 150;

interface ContextMenuState {
  zoneId: string;
  x: number;
  y: number;
}

interface Props {
  onBack: () => void;
}

function toLocalPoint(clientX: number, clientY: number, container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const scale = container.offsetWidth ? rect.width / container.offsetWidth : 1;
  return {
    x: Math.min(Math.max((clientX - rect.left) / scale, 8), 393 - MENU_W - 8),
    y: Math.min(Math.max((clientY - rect.top) / scale, 8), SCREEN_H - MENU_H - 8),
  };
}

export function MapScreen({ onBack }: Props) {
  const screenRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const zones = useMemo(() => withGeo(ZONES, USER), []);
  const hereZone = useMemo(() => zones.find((zone) => zone.here) ?? null, [zones]);

  const [filter, setFilter] = useState<ZoneGroupId | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetHeight, setSheetHeight] = useState(COLLAPSED_SHEET_H);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const visibleZones = useMemo(() => {
    return zones
      .filter((zone) => filter === "all" || zone.group === filter)
      .sort((a, b) => Number(b.here) - Number(a.here) || a.km - b.km);
  }, [zones, filter]);

  const controllerRef = useZoneMap({
    containerRef: mapContainerRef,
    zones,
    user: USER,
    token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    onSelectZone: (id) => toggleZone(id),
    onLongPressZone: (id, x, y) => openContextMenuAt(id, x, y),
  });

  // initial camera fit, once the controller exists
  useEffect(() => {
    controllerRef.current?.fitAll(COLLAPSED_SHEET_H, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    controllerRef.current?.setFilter(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function openZone(id: string) {
    setSelectedId(id);
    controllerRef.current?.setSelected(id);
    setSheetHeight((current) => (current > COLLAPSED_SHEET_H + 4 ? COLLAPSED_SHEET_H : current));
    const zone = zones.find((z) => z.id === id);
    if (zone) controllerRef.current?.flyToZone(zone, COLLAPSED_SHEET_H);
  }

  function closeZone() {
    setSelectedId(null);
    controllerRef.current?.setSelected(null);
    controllerRef.current?.fitAll(sheetHeight, true);
  }

  function toggleZone(id: string) {
    if (selectedId === id) closeZone();
    else openZone(id);
  }

  function openContextMenuAt(zoneId: string, clientX: number, clientY: number) {
    if (!screenRef.current) return;
    const { x, y } = toLocalPoint(clientX, clientY, screenRef.current);
    setContextMenu({ zoneId, x, y });
  }

  function flash(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }

  const contextZone = contextMenu ? (zones.find((z) => z.id === contextMenu.zoneId) ?? null) : null;

  return (
    <div className="screen map-screen" ref={screenRef}>
      {/* inline position/inset: maplibre-gl's own stylesheet sets the container
          (`.maplibregl-map`) to `position: relative`, and since that rule has the
          same specificity as `.map-canvas` and loads after it, it wins the
          cascade — an inline style is the reliable way to keep this absolute. */}
      <div
        className="map-canvas"
        ref={mapContainerRef}
        style={{ position: "absolute", inset: 0 }}
      />

      <MapHeader
        compact={sheetHeight > HEADER_COMPACT_ABOVE}
        inZone={!!hereZone}
        filter={filter}
        zones={zones}
        onBack={onBack}
        onFilterChange={setFilter}
      />

      <button
        type="button"
        className={`map-locate${sheetHeight > LOCATE_HIDE_ABOVE ? " map-locate--hidden" : ""}`}
        style={{ bottom: sheetHeight + 14 }}
        onClick={() => controllerRef.current?.flyToUser()}
        aria-label="Your location"
      >
        <IconLocationPin size={20} />
      </button>

      <ZoneSheet
        zones={visibleZones}
        selectedId={selectedId}
        height={sheetHeight}
        min={COLLAPSED_SHEET_H}
        max={EXPANDED_SHEET_H}
        onHeightChange={setSheetHeight}
        onDragEnd={() =>
          setSheetHeight((current) =>
            current < (COLLAPSED_SHEET_H + EXPANDED_SHEET_H) / 2 ? COLLAPSED_SHEET_H : EXPANDED_SHEET_H,
          )
        }
        onSelectZone={toggleZone}
        onLongPressZone={openContextMenuAt}
      />

      {contextMenu && contextZone && (
        <ZoneContextMenu
          zone={contextZone}
          x={contextMenu.x}
          y={contextMenu.y}
          onDismiss={() => setContextMenu(null)}
          onDirections={() => {
            setContextMenu(null);
            openZone(contextZone.id);
          }}
          onShare={() => {
            setContextMenu(null);
            flash("Zone link copied");
          }}
          onReport={() => {
            setContextMenu(null);
            flash("Thanks — we'll take a look");
          }}
        />
      )}

      {toast && (
        <div className="map-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
