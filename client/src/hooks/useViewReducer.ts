import { useReducer, Dispatch } from "react";

import { Place, LngLat } from "../places";
import { Directions } from "../components/Map";

type OverviewWithoutLocation = {
  type: "overviewWithoutLocation";
};

type Overview = {
  type: "overview";
  location: LngLat;
};

type FetchingPlaces = {
  type: "fetchingPlaces";
  location: LngLat;
};

type SuggestingPlaces = {
  type: "suggestingPlaces";
  location: LngLat;
};

type PreviewPlaceWithoutLocation = {
  type: "previewPlaceWithoutLocation";
  place: Place;
};

type PreviewPlace = {
  type: "previewPlace";
  location: LngLat;
  place: Place;
};

type PreviewPlaceWithRoute = {
  type: "previewPlaceWithRoute";
  location: LngLat;
  place: Place;
  directions: Directions;
};

type Navigation = {
  type: "navigation";
  location: LngLat;
  place: Place;
  directions: Directions;
};

export type ViewState =
  | OverviewWithoutLocation
  | Overview
  | FetchingPlaces
  | SuggestingPlaces
  | PreviewPlaceWithoutLocation
  | PreviewPlace
  | PreviewPlaceWithRoute
  | Navigation;

type ViewStateWithoutLocation =
  | OverviewWithoutLocation
  | PreviewPlaceWithoutLocation;

type ViewStateWithLocation = Exclude<ViewState, ViewStateWithoutLocation>;

export function hasLocation(
  viewState: ViewState,
): viewState is ViewStateWithLocation {
  const resultByType: { [K in ViewState["type"]]: boolean } = {
    overviewWithoutLocation: false,
    overview: true,
    fetchingPlaces: true,
    suggestingPlaces: true,
    previewPlaceWithoutLocation: false,
    previewPlace: true,
    previewPlaceWithRoute: true,
    navigation: true,
  };
  return resultByType[viewState.type];
}

type ViewStateWithPlace =
  | PreviewPlaceWithoutLocation
  | PreviewPlace
  | PreviewPlaceWithRoute
  | Navigation;

export function hasPlace(
  viewState: ViewState,
): viewState is ViewStateWithPlace {
  const resultByType: { [K in ViewState["type"]]: boolean } = {
    overviewWithoutLocation: false,
    overview: false,
    fetchingPlaces: false,
    suggestingPlaces: false,
    previewPlaceWithoutLocation: true,
    previewPlace: true,
    previewPlaceWithRoute: true,
    navigation: true,
  };
  return resultByType[viewState.type];
}

type ViewStateWithDirections = PreviewPlaceWithRoute | Navigation;

export function hasDirections(
  viewState: ViewState,
): viewState is ViewStateWithDirections {
  const resultByType: { [K in ViewState["type"]]: boolean } = {
    overviewWithoutLocation: false,
    overview: false,
    fetchingPlaces: false,
    suggestingPlaces: false,
    previewPlaceWithoutLocation: false,
    previewPlace: false,
    previewPlaceWithRoute: true,
    navigation: true,
  };
  return resultByType[viewState.type];
}

export type ViewStateAction =
  | { type: "SET_LOCATION"; location: LngLat }
  | { type: "SUGGEST_PLACES" }
  | { type: "GO_TO_OVERVIEW" }
  | { type: "SELECT_PLACE"; place: Place }
  | { type: "UNSELECT_PLACE" }
  | { type: "SET_DIRECTIONS"; directions: Directions; place: Place };

const viewStateReducer = (
  state: ViewState,
  action: ViewStateAction,
): ViewState => {
  switch (action.type) {
    case "SET_LOCATION": {
      const { location } = action;
      if (state.type === "overviewWithoutLocation") {
        return {
          type: "overview",
          location,
        };
      }
      if (state.type === "previewPlaceWithoutLocation") {
        return {
          ...state,
          type: "previewPlace",
          location,
        };
      }
      return {
        ...state,
        location,
      };
    }

    case "SUGGEST_PLACES": {
      if (!hasLocation(state)) {
        console.warn("Cannot suggest places since location unknown.");
        return state;
      }
      return {
        type: "suggestingPlaces",
        location: state.location,
      };
    }

    case "GO_TO_OVERVIEW": {
      if (!hasLocation(state)) {
        return {
          type: "overviewWithoutLocation",
        };
      }
      return {
        type: "overview",
        location: state.location,
      };
    }

    case "SELECT_PLACE": {
      const { place } = action;
      if (
        (state.type === "previewPlace" ||
          state.type === "previewPlaceWithRoute") &&
        state.place.id === place.id
      ) {
        return state;
      }

      if (!hasLocation(state)) {
        return {
          type: "previewPlaceWithoutLocation",
          place,
        };
      }
      return {
        type: "previewPlace",
        location: state.location,
        place,
      };
    }

    case "UNSELECT_PLACE": {
      if (!hasLocation(state)) {
        return { type: "overviewWithoutLocation" };
      }
      return {
        type: "overview",
        location: state.location,
      };
    }

    case "SET_DIRECTIONS": {
      const { directions, place } = action;
      if (hasPlace(state) && state.place.id !== place.id) {
        console.warn(
          "Received directions do not match currently selected place",
        );
        return state;
      }
      if (
        state.type === "previewPlace" ||
        state.type === "previewPlaceWithRoute"
      ) {
        return {
          ...state,
          type: "previewPlaceWithRoute",
          directions,
        };
      }
      if (state.type === "navigation") {
        return {
          ...state,
          directions,
        };
      }
      console.warn("Cannot set directions without selected place.");
      return state;
    }
  }
};

const initialViewState = {
  type: "overviewWithoutLocation",
} as const;

export default function useViewReducer() {
  const [viewState, dispatch] = useReducer(viewStateReducer, initialViewState);

  const dispatchWithLogging: Dispatch<ViewStateAction> = (
    action: ViewStateAction,
  ): void => {
    dispatch(action);
  };

  return [viewState, dispatchWithLogging] as const;
}
