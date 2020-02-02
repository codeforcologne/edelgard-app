import axios from "axios";
import { Latitude, Longitude } from "../places";
import Sentry from "./sentry";
import { Directions } from "../components/Map";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

interface Point {
  lat: Latitude;
  lng: Longitude;
}

export async function fetchDirections(
  origin: Point,
  destination: Point,
): Promise<Directions> {
  try {
    return await fetchDirectionsMapbox(origin, destination);
  } catch (mapboxError) {
    try {
      return await fetchDirectionsGraphhopper(origin, destination);
    } catch (graphhopperError) {
      throw mapboxError;
    }
  }
}

async function fetchDirectionsMapbox(
  origin: Point,
  destination: Point,
): Promise<Directions> {
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
      scope.setExtra("action", "fetching route from Mapbox");
      scope.setExtra("url", url);
      Sentry.captureException(error);
    });

    throw error;
  }
}

const graphhopperEndpoint = process.env.REACT_APP_GRAPHHOPPER_ENDPOINT;

async function fetchDirectionsGraphhopper(
  origin: Point,
  destination: Point,
): Promise<Directions> {
  if (!graphhopperEndpoint) {
    throw new Error("No Graphhopper endpoint specified");
  }
  const endpoint = `${graphhopperEndpoint}route?vehicle=foot&points_encoded=false&`;
  const url = `${endpoint}${endpoint}point=${origin.lat},${origin.lng}&point=${destination.lat},${destination.lng}`;
  try {
    const response = await axios.get(url, {
      timeout: 4000,
    });
    const graphhopperData = response.data;
    const mapboxData = {
      routes: graphhopperData.paths.map((path: any) => ({
        geometry: path.points,
        duration: Math.ceil(path.time / 1000),
      })),
    };
    return mapboxData;
  } catch (error) {
    console.error(error);
    Sentry.withScope(scope => {
      scope.setExtra("action", "fetching route from Graphhopper");
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
