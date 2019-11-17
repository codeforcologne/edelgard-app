import React from "react";
import ReactMapboxGl from "react-mapbox-gl";

import useCurrentMinute from "../../hooks/useCurrentMinute";

import { Place, LngLat } from "../../places";
import { hasPlace, hasDirections } from "../../hooks/useViewReducer";
import { useViewState } from "../ViewContext";

import RouteLayers from "./RouteLayers";
import PlaceLayers from "./PlaceLayers";
import LocationLayers from "./LocationLayers";
import usePrevious from "../../hooks/usePrevious";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

if (!accessToken) {
  throw new Error(
    "Must provide Mapbox access token via environment variable REACT_APP_MAPBOX_TOKEN",
  );
}

const MapboxMap = ReactMapboxGl({ accessToken });

interface Waypoint {
  distance: number;
  name: string;
  location: LngLat;
}

export interface Directions {
  routes: any[];
  waypoints: Waypoint[];
}

// react-mapbox-gl requires zoom, bearing and pitch to be arrays
// so that an update can be triggered by creating a new reference
const initialZoom = [14] as [number];

function boundingBox(coordinates: readonly LngLat[]): [LngLat, LngLat] {
  const lngs = coordinates.map(coordinate => coordinate[0]);
  const lats = coordinates.map(coordinate => coordinate[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ] as [LngLat, LngLat];
}

interface MapProps {
  places: Place[];
  suggestedPlaces: [Place, number][] | null;
  center: LngLat;
  location: LngLat | null;
  isCentered: boolean;
  onSelectPlace: (id: string | null) => void;
  heading: number | null;
  children?: React.ReactNode;
}
export default function Map({
  places,
  suggestedPlaces,
  center,
  isCentered,
  onSelectPlace,
  heading,
  children,
}: MapProps) {
  const viewState = useViewState();

  let location: LngLat | null = null;
  if (
    viewState.type !== "overviewWithoutLocation" &&
    viewState.type !== "previewPlaceWithoutLocation"
  ) {
    location = viewState.location;
  }

  const currentTime = useCurrentMinute();

  const previousViewState = usePrevious(viewState);

  const fitBounds = React.useMemo(() => {
    switch (viewState.type) {
      case "suggestingPlaces": {
        const { location } = viewState;
        if (suggestedPlaces) {
          const placeCoordinates = suggestedPlaces.map(
            ([foundPlace]) => [foundPlace.lng, foundPlace.lat] as LngLat,
          );
          const coordinates = [location, ...placeCoordinates];
          return boundingBox(coordinates);
        }
        return undefined;
      }

      case "previewPlace": {
        const { location, place } = viewState;
        const placeLngLat = [place.lng, place.lat] as LngLat;
        return boundingBox([location, placeLngLat]);
      }

      case "previewPlaceWithRoute": {
        const { location, place, directions } = viewState;

        if (
          previousViewState &&
          hasPlace(previousViewState) &&
          hasDirections(previousViewState) &&
          previousViewState.place.id === viewState.place.id
        ) {
          // places did not change, so don't fit to new bounds
          return undefined;
        }

        const placeLngLat = [place.lng, place.lat] as LngLat;

        const route =
          directions &&
          directions.routes &&
          directions.routes.length > 0 &&
          directions.routes[0];

        if (route) {
          const {
            coordinates: routeCoordinates,
          }: { coordinates: LngLat[] } = route.geometry;
          const coordinates = [...routeCoordinates, location, placeLngLat];
          return boundingBox(coordinates);
        }

        return boundingBox([location, placeLngLat]);
      }
    }
    return undefined;
  }, [viewState, previousViewState, suggestedPlaces]);

  const [mapHasLoaded, setMapHasLoaded] = React.useState(false);

  return (
    <>
      <MapboxMap
        // eslint-disable-next-line react/style-prop-object
        style="mapbox://styles/mapbox/light-v10"
        containerStyle={{
          flex: 1,
          opacity: mapHasLoaded ? 1 : 0,
          transition: "opacity 0.5s",
        }}
        center={center}
        zoom={initialZoom}
        fitBounds={fitBounds}
        fitBoundsOptions={{
          padding: {
            top: 120,
            right: 60,
            bottom: viewState.type === "suggestingPlaces" ? 340 : 200,
            left: 60,
          },
        }}
        onStyleLoad={map => {
          map.resize();
          setMapHasLoaded(true);
        }}
      >
        <>
          {(viewState.type === "previewPlaceWithRoute" ||
            viewState.type === "navigation") && (
            <RouteLayers directions={viewState.directions} />
          )}
          <PlaceLayers
            places={places}
            suggestedPlaces={
              viewState.type === "suggestingPlaces" ? suggestedPlaces : null
            }
            selectedPlaceId={hasPlace(viewState) ? viewState.place.id : null}
            onSelectPlace={onSelectPlace}
            currentTime={currentTime}
          />
          <LocationLayers
            location={location}
            isCentered={isCentered}
            heading={heading}
          />
          {children}
        </>
      </MapboxMap>
    </>
  );
}
