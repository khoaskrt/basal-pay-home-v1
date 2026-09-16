export type ZoneGroupId = "area" | "airport" | "resort";

export interface GroupMeta {
  label: string;
}

export type PlaceType = "food" | "shop" | "stay";

export interface Place {
  name: string;
  type: PlaceType;
  rating: string;
  distance: string;
}

/** [lat, lng] pairs, matching the Figma/prototype source data. */
export type LatLng = [number, number];

export interface Zone {
  id: string;
  group: ZoneGroupId;
  name: string;
  desc: string;
  poly: LatLng[];
  places: Place[];
}

/** A zone enriched with the geometry derived at runtime against `USER`. */
export interface ZoneWithGeo extends Zone {
  center: LatLng;
  here: boolean;
  km: number;
}
