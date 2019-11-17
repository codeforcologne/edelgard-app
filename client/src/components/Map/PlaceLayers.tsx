import React from "react";
import { Layer, Feature } from "react-mapbox-gl";

import { getOpenState } from "../../hours";
import { Place } from "../../places";
import images from "./images";

const setCursor = (value: string, map: any) => {
  map.getCanvas().style.cursor = value;
};

interface PlaceLayersProps {
  places: Place[];
  suggestedPlaces: [Place, number][] | null;
  selectedPlaceId: string | null;
  onSelectPlace: (id: string | null) => void;
  currentTime: Date;
}

const placeIsOpen = (place: Place, currentTime: Date) =>
  place.hours && getOpenState(place.hours, currentTime).state;

export default function PlaceLayers({
  places,
  suggestedPlaces,
  selectedPlaceId,
  onSelectPlace,
  currentTime,
}: PlaceLayersProps) {
  function isSelectedPlace(place: Place): boolean {
    return place.id === selectedPlaceId;
  }

  return (
    <>
      <Layer
        type="symbol"
        layout={{
          "icon-image": "icon-place-unavailable",
          "icon-size": 0.5,
        }}
        paint={{
          "icon-opacity": 0.75,
        }}
        images={images}
      >
        {places
          .filter(place => !placeIsOpen(place, currentTime))
          .map(place => (
            <Feature
              coordinates={[place.lng, place.lat]}
              onClick={() => {
                onSelectPlace(place.id);
              }}
              onMouseEnter={(event: any) => setCursor("pointer", event.map)}
              onMouseLeave={(event: any) => setCursor("", event.map)}
              key={place.id}
            />
          ))}
      </Layer>
      <Layer
        type="symbol"
        layout={{
          "icon-image": "icon-place",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-field": ["get", "rank"],
          "text-allow-overlap": true,
        }}
        paint={{
          "icon-opacity": 0.75,
          "text-halo-color": "white",
          "text-halo-width": 3,
          "text-halo-blur": 8,
        }}
        images={images}
      >
        {places
          .filter(
            place => !isSelectedPlace(place) && placeIsOpen(place, currentTime),
          )
          .map(place => (
            <Feature
              coordinates={[place.lng, place.lat]}
              onClick={() => {
                onSelectPlace(place.id);
              }}
              onMouseEnter={(event: any) => setCursor("pointer", event.map)}
              onMouseLeave={(event: any) => setCursor("", event.map)}
              key={place.id}
              properties={{
                rank:
                  (suggestedPlaces || []).findIndex(
                    ([foundPlace]) => foundPlace.id === place.id,
                  ) + 1 || "",
              }}
            />
          ))}
      </Layer>
      <Layer
        type="symbol"
        layout={{
          "icon-image": "icon-place-selected",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
        }}
        paint={{
          "icon-opacity": 0.75,
        }}
        images={images}
      >
        {places
          .filter(
            place => isSelectedPlace(place) && placeIsOpen(place, currentTime),
          )
          .map(place => (
            <Feature
              coordinates={[place.lng, place.lat]}
              onClick={() => {
                onSelectPlace(place.id);
              }}
              onMouseEnter={(event: any) => setCursor("pointer", event.map)}
              onMouseLeave={(event: any) => setCursor("", event.map)}
              key={place.id}
            />
          ))}
      </Layer>
    </>
  );
}
