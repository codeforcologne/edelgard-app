import React from "react";
import { getOpenState } from "../hours";
import useCurrentMinute from "./useCurrentMinute";
import { Place, distance } from "../places";
import { hasLocation } from "./useViewReducer";
import { useViewState } from "../components/ViewContext";

export default function useSuggestedPlaces(places: Place[], maxNum: number) {
  const viewState = useViewState();
  const currentMinute = useCurrentMinute();

  const suggestedPlaces = React.useMemo(() => {
    if (!hasLocation(viewState)) {
      return null;
    }

    const placesWithDistance = places.map(
      place =>
        [
          place,
          distance(
            { lng: viewState.location[0], lat: viewState.location[1] },
            place,
          ),
        ] as [Place, number],
    );
    placesWithDistance.sort(
      ([, distanceA], [, distanceB]) => distanceA - distanceB,
    );
    const openPlacesWithDistance = placesWithDistance.filter(
      ([place]) =>
        place.hours && getOpenState(place.hours, currentMinute).state,
    );

    return openPlacesWithDistance.slice(0, maxNum);
  }, [viewState, currentMinute, places, maxNum]);

  return suggestedPlaces;
}
