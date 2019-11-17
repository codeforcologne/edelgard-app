import haversine from "haversine";

export type Longitude = number & { type: "longitude" };
export type Latitude = number & { type: "latitude" };

export type LngLat = [Longitude, Latitude];

interface Point {
  lng: Longitude;
  lat: Latitude;
}

export interface Place {
  lat: Latitude;
  lng: Longitude;
  id: string;
  title: string;
  address: string;
  desc: string;
  hours: string;
  imageUrl?: string;
}

export function distance(a: Point, b: Point): number {
  return haversine(a, b, { format: "{lat,lng}", unit: "meter" });
}
