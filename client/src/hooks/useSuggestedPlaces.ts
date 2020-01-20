import React from "react";
import { getOpenState } from "../hours";
import useCurrentMinute from "./useCurrentMinute";
import { Place, distance } from "../places";
import { hasLocation } from "./useViewReducer";
import { useViewState } from "../components/ViewContext";

export default function useSuggestedPlaces(
  places: Place[],
  maxNum: number,
): [Place, number][] | null {
  const viewState = useViewState();
  const currentMinute = useCurrentMinute();

  const suggestedPlaces = React.useMemo(() => {
    if (!hasLocation(viewState)) {
      return null;
    }

    const openPlaces = places.filter(
      place => place.hours && getOpenState(place.hours, currentMinute).state,
    );

    const [lng, lat] = viewState.location;

    const openPlacesWithDistance = openPlaces
      .map(place => [place, distance({ lng, lat }, place)] as [Place, number])
      .sort(([, distanceA], [, distanceB]) => distanceA - distanceB);

    return openPlacesWithDistance.slice(0, maxNum);
  }, [viewState, currentMinute, places, maxNum]);

  return suggestedPlaces;
}
