import React from "react";

import { Place } from "../places";
import PlaceList from "./PlaceList";
import PlaceDetail from "./PlaceDetail";
import { useViewState } from "./ViewContext";

interface PlaceViewProps {
  suggestedPlaces: [Place, number][] | null;
  selectPlace: (placeId: string | null) => void;
  currentTime: Date;
}

export default ({
  suggestedPlaces,
  selectPlace,
  currentTime,
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
