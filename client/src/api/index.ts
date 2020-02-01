import axios from "axios";
import { Latitude, Longitude } from "../places";
import Sentry from "./sentry";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

interface Point {
  lat: Latitude;
  lng: Longitude;
}

export async function fetchDirections(origin: Point, destination: Point) {
  const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}`;
  try {
    const response = await axios.get(url, {
      params: {
        access_token: accessToken,
        overview: "full",
        geometries: "geojson",
        alternatives: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    Sentry.withScope(scope => {
      scope.setExtra("action", "fetching route");
      scope.setExtra("url", url);
      Sentry.captureException(error);
    });
    throw error;
  }
}

export async function fetchDuration(origin: Point, destination: Point) {
  const directions = await fetchDirections(origin, destination);
  if (directions.routes.length < 1) {
    return Infinity;
  }
  return directions.routes[0].duration;
}
