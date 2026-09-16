import type { LatLng, Zone, ZoneWithGeo } from "./types";

const EARTH_RADIUS_KM = 6371;

export function centerOf(poly: LatLng[]): LatLng {
  let lat = 0;
  let lng = 0;
  for (const [pointLat, pointLng] of poly) {
    lat += pointLat;
    lng += pointLng;
  }
  return [lat / poly.length, lng / poly.length];
}

/** Haversine great-circle distance, in kilometres. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) *
      Math.cos((b[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(s));
}

/** Ray-casting point-in-polygon test; `point` and `poly` are [lat, lng]. */
export function isInsidePolygon(point: LatLng, poly: LatLng[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i];
    const [yj, xj] = poly[j];
    const crosses =
      yi > point[0] !== yj > point[0] &&
      point[1] < ((xj - xi) * (point[0] - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

/** Whether `point` falls inside any of `zones` — the single source of truth
 * for the "in zone" boolean shared between the Home chip and the map header. */
export function isInAnyZone(point: LatLng, zones: Zone[]): boolean {
  return zones.some((zone) => isInsidePolygon(point, zone.poly));
}

export function withGeo(zones: Zone[], user: LatLng): ZoneWithGeo[] {
  return zones.map((zone) => {
    const center = centerOf(zone.poly);
    return {
      ...zone,
      center,
      here: isInsidePolygon(user, zone.poly),
      km: distanceKm(user, center),
    };
  });
}

/** Shortens a handful of long zone names for the on-map label markers. */
export function shortZoneName(name: string): string {
  return name
    .replace("Key Area ", "")
    .replace("Da Nang International Airport", "Da Nang Airport")
    .replace("Legend Danang Golf Resort", "Legend Golf")
    .replace("Montgomerie Links Vietnam", "Montgomerie")
    .replace("Vinpearl Golf Nam Hoi An", "Vinpearl Nam Hoi An")
    .replace("Ba Na Hills Golf Club", "Ba Na Golf");
}
