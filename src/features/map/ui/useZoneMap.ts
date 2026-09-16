"use client";

import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { shortZoneName } from "@/features/map/model/geo";
import type { ZoneGroupId, ZoneWithGeo } from "@/features/map/model/types";

const HERE_COLOR = "#16bd73";
const OFF_COLOR = "#8a93a6";
const SELECTED_COLOR = "#2b59ff";
const LONG_PRESS_MS = 480;
const MOVE_CANCEL_PX = 8;

interface Options {
  containerRef: React.RefObject<HTMLDivElement | null>;
  zones: ZoneWithGeo[];
  user: [number, number];
  token: string | undefined;
  onSelectZone: (id: string) => void;
  onLongPressZone: (id: string, clientX: number, clientY: number) => void;
}

interface Controller {
  fitAll: (bottomPadding: number, animate?: boolean) => void;
  flyToZone: (zone: ZoneWithGeo, bottomPadding: number) => void;
  flyToUser: () => void;
  setSelected: (id: string | null) => void;
  setFilter: (group: ZoneGroupId | "all") => void;
  resize: () => void;
}

function toLngLat([lat, lng]: [number, number]): [number, number] {
  return [lng, lat];
}

/**
 * Owns the imperative maplibre-gl instance: zone polygons, labels, the user
 * marker, selection/filter styling, and press-and-hold detection. Returns a
 * ref to a small controller the screen calls into (fitAll/flyTo/etc.).
 */
export function useZoneMap({
  containerRef,
  zones,
  user,
  token,
  onSelectZone,
  onLongPressZone,
}: Options) {
  const controllerRef = useRef<Controller | null>(null);
  const callbacksRef = useRef({ onSelectZone, onLongPressZone });

  // Keep the latest callbacks available to the mount-only effect below
  // without needing to re-run it (and re-create the map) every render.
  useEffect(() => {
    callbacksRef.current = { onSelectZone, onLongPressZone };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || zones.length === 0) return;

    const map = new maplibregl.Map({
      container,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: toLngLat(user),
      zoom: 10,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    // surface style/tile load failures instead of failing silently
    map.on("error", (e) => console.error("maplibre error", e.error));
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const markers = new Map<string, maplibregl.Marker>();
    let selectedId: string | null = null;
    let activeFilter: ZoneGroupId | "all" = "all";

    const applyFilter = () => {
      const expr: maplibregl.FilterSpecification | null =
        activeFilter === "all" ? null : ["==", ["get", "group"], activeFilter];
      if (map.getLayer("zones-fill")) map.setFilter("zones-fill", expr);
      if (map.getLayer("zones-line")) map.setFilter("zones-line", expr);
      markers.forEach((marker, id) => {
        const zone = zones.find((z) => z.id === id);
        const visible = activeFilter === "all" || zone?.group === activeFilter;
        marker.getElement().style.display = visible ? "" : "none";
      });
    };

    map.on("load", () => {
      map.addSource("zones", {
        type: "geojson",
        promoteId: "id",
        data: {
          type: "FeatureCollection",
          features: zones.map((zone) => ({
            type: "Feature",
            id: zone.id,
            properties: { id: zone.id, group: zone.group, here: zone.here },
            geometry: {
              type: "Polygon",
              coordinates: [zone.poly.map(toLngLat)],
            },
          })),
        },
      });

      map.addLayer({
        id: "zones-fill",
        type: "fill",
        source: "zones",
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            SELECTED_COLOR,
            ["boolean", ["get", "here"], false],
            HERE_COLOR,
            OFF_COLOR,
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            0.22,
            ["boolean", ["get", "here"], false],
            0.24,
            0.12,
          ],
        },
      });

      map.addLayer({
        id: "zones-line",
        type: "line",
        source: "zones",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            SELECTED_COLOR,
            ["boolean", ["get", "here"], false],
            HERE_COLOR,
            OFF_COLOR,
          ],
          "line-width": 2,
          "line-opacity": 0.9,
        },
      });

      zones.forEach((zone) => {
        const el = document.createElement("div");
        el.className = "zone-label";
        el.textContent = shortZoneName(zone.name);
        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(toLngLat(zone.center))
          .addTo(map);
        markers.set(zone.id, marker);
      });

      const userEl = document.createElement("div");
      userEl.className = "user-pin";
      userEl.innerHTML = '<i class="user-pin__pulse"></i><i class="user-pin__dot"></i>';
      new maplibregl.Marker({ element: userEl, anchor: "center" })
        .setLngLat(toLngLat(user))
        .addTo(map);

      map.on("click", "zones-fill", (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id) callbacksRef.current.onSelectZone(id);
      });
      map.on("mouseenter", "zones-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "zones-fill", () => {
        map.getCanvas().style.cursor = "";
      });

      applyFilter();
    });

    // press-and-hold on a zone opens the context menu
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let pressStart: { x: number; y: number } | null = null;

    const clearPress = () => {
      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = null;
      pressStart = null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pressStart = { x: e.clientX, y: e.clientY };
      pressTimer = setTimeout(() => {
        // getBoundingClientRect() reflects the *visual* (post CSS-scale) box while
        // maplibre expects canvas-local (pre-scale) pixels, so undo ScreenScaler's
        // transform here — otherwise hit-testing drifts whenever the phone frame
        // is shown smaller than 1:1 (desktop preview).
        const canvasEl = map.getCanvas();
        const rect = canvasEl.getBoundingClientRect();
        const scale = canvasEl.clientWidth ? rect.width / canvasEl.clientWidth : 1;
        const point: [number, number] = [
          (e.clientX - rect.left) / scale,
          (e.clientY - rect.top) / scale,
        ];
        const hit = map.queryRenderedFeatures(point, { layers: ["zones-fill"] });
        const id = hit[0]?.properties?.id as string | undefined;
        if (id) callbacksRef.current.onLongPressZone(id, e.clientX, e.clientY);
        pressStart = null;
      }, LONG_PRESS_MS);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!pressStart) return;
      const dx = e.clientX - pressStart.x;
      const dy = e.clientY - pressStart.y;
      if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearPress();
    };

    const canvas = map.getCanvas();
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", clearPress);
    canvas.addEventListener("pointerleave", clearPress);
    canvas.addEventListener("pointercancel", clearPress);

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);

    controllerRef.current = {
      fitAll(bottomPadding, animate = true) {
        const b = new maplibregl.LngLatBounds();
        zones.forEach((zone) => b.extend(toLngLat(zone.center)));
        b.extend(toLngLat(user));
        map.fitBounds(b, {
          padding: { top: 150, bottom: bottomPadding + 16, left: 26, right: 26 },
          animate,
        });
      },
      flyToZone(zone, bottomPadding) {
        const b = new maplibregl.LngLatBounds();
        zone.poly.forEach((point) => b.extend(toLngLat(point)));
        map.fitBounds(b, {
          padding: { top: 40, bottom: bottomPadding + 16, left: 40, right: 40 },
          maxZoom: 16,
          duration: 900,
        });
      },
      flyToUser() {
        map.flyTo({ center: toLngLat(user), zoom: 14, duration: 800 });
      },
      setSelected(id) {
        if (!map.getSource("zones")) return;
        if (selectedId) {
          map.setFeatureState({ source: "zones", id: selectedId }, { selected: false });
        }
        selectedId = id;
        if (id) {
          map.setFeatureState({ source: "zones", id }, { selected: true });
        }
      },
      setFilter(group) {
        activeFilter = group;
        if (map.isStyleLoaded()) applyFilter();
      },
      resize() {
        map.resize();
      },
    };

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", clearPress);
      canvas.removeEventListener("pointerleave", clearPress);
      canvas.removeEventListener("pointercancel", clearPress);
      resizeObserver.disconnect();
      markers.forEach((marker) => marker.remove());
      map.remove();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the map is built once from the initial zones/user
  }, []);

  return controllerRef;
}
