import React from "react";

import { Place } from "../places";
import PlaceList from "./PlaceList";
import PlaceDetail from "./PlaceDetail";
import { useViewState } from "./ViewContext";

interface PlaceViewProps {
  suggestedPlaces: [Place, number][] | null;
  selectPlace: (placeId: string | null) => void;
  currentTime: Date;
  geolocationPermissionState: PermissionState | undefined;
}

export default ({
  suggestedPlaces,
  selectPlace,
  currentTime,
  geolocationPermissionState,
}: PlaceViewProps): JSX.Element | null => {
  const viewState = useViewState();

  switch (viewState.type) {
    case "previewPlaceWithoutLocation":
    case "previewPlace": {
      return (
        <PlaceDetail
          place={viewState.place}
          directions={null}
          currentTime={currentTime}
          geolocationPermissionState={geolocationPermissionState}
        />
      );
    }

    case "previewPlaceWithRoute":
    case "navigation": {
      return (
        <PlaceDetail
          place={viewState.place}
          directions={viewState.directions}
          currentTime={currentTime}
          geolocationPermissionState={geolocationPermissionState}
        />
      );
    }

    case "suggestingPlaces": {
      if (!suggestedPlaces) {
        return <>Keine Schutzorte gefunden</>;
      }

      return (
        <PlaceList
          places={suggestedPlaces}
          setSelectedPlaceId={selectPlace}
          currentTime={currentTime}
        />
      );
    }

    default: {
      return null;
    }
  }
};
