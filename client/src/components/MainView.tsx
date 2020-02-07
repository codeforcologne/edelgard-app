import React from "react";

import "typeface-open-sans-condensed";
import Div100vh from "react-div-100vh";

import useGeolocation from "../hooks/useGeolocation";
import usePrevious from "../hooks/usePrevious";
import useCurrentMinute from "../hooks/useCurrentMinute";

import Map, { Directions } from "./Map";
import Drawer from "./Drawer";
import Header from "./Header";
import DebugInfo from "./DebugInfo";
import useCompassHeading from "../hooks/useCompassHeading";
import useThrottle from "../hooks/useThrottle";
import {
  hasLocation,
  ViewStateAction,
  hasPlace,
} from "../hooks/useViewReducer";

import LocationButton from "./LocationButton";
import EmergencyButton from "./EmergencyButton";
import { useViewState, useViewDispatch } from "./ViewContext";
import PlaceView from "./PlaceView";
import { fetchDirections } from "../api";
import useSuggestedPlaces from "../hooks/useSuggestedPlaces";
import usePlaces from "../hooks/usePlaces";
import { Longitude, Latitude, LngLat, Place } from "../places";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import FacebookWarning from "./FacebookWarning";

const throttle = <A extends unknown[]>(
  func: (...args: A) => void,
  limit: number,
): ((...args: A) => void) => {
  let inThrottle = false;
  return function(this: unknown, ...args: A): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

function setDirections(
  viewDispatch: React.Dispatch<ViewStateAction>,
  directions: Directions,
  place: Place,
): void {
  viewDispatch({ type: "SET_DIRECTIONS", directions, place });
}

const reasonByPositionErrorCode = {
  1: "Zugriff wurde durch den Browser verweigert",
  // 2: "Interner Fehler",
  3: "Zeitüberschreitung",
} as { [key: number]: string | undefined };

const cologneCathedral: LngLat = [6.958307 as Longitude, 50.941357 as Latitude];
const initialCenter = cologneCathedral;
function RouteMap() {
  const currentTime = useCurrentMinute();
  const [center, setCenter] = React.useState<LngLat>(initialCenter);

  let [
    geolocationPermissionState,
    setGeolocationPermissionState,
  ] = React.useState<PermissionState | undefined>(undefined);
  if ("permissions" in window.navigator) {
    window.navigator.permissions
      .query({ name: "geolocation" })
      .then(permissionStatus =>
        setGeolocationPermissionState(permissionStatus.state),
      );
  }

  const [hasRequestedLocation, setHasRequestedLocation] = React.useState<
    boolean
  >(false);

  const {
    position: geolocation,
    error: geolocationError,
  }: {
    position: Position | undefined;
    error: PositionError | undefined;
  } = useGeolocation(
    undefined,
    undefined,
    geolocationPermissionState === "granted" || hasRequestedLocation,
  );

  React.useEffect(() => {
    const reason = geolocationError
      ? reasonByPositionErrorCode[geolocationError.code]
      : undefined;
    if (geolocationError) {
      setErrorMessage(
        <>
          Ihr Standort konnte nicht ermittelt werden.
          {reason && (
            <>
              <br />({reason})
            </>
          )}
        </>,
      );
    }
  }, [geolocationError]);

  let location: LngLat | null;
  location = React.useMemo(() => {
    return geolocation
      ? ([geolocation.coords.longitude, geolocation.coords.latitude] as LngLat)
      : null;
  }, [geolocation]);
  const previousLocation = usePrevious(location);

  const viewState = useViewState();
  const viewDispatch = useViewDispatch();

  function centerView(location: LngLat | null): void {
    if (location) {
      setCenter([location[0], location[1]]);
    }
  }

  const places = usePlaces();

  const suggestedPlaces = useSuggestedPlaces(places, 3);

  const [hasRequestedSearch, setHasRequestedSearch] = React.useState(false);
  React.useEffect(() => {
    if (hasLocation(viewState) && hasRequestedSearch) {
      setHasRequestedSearch(false);
      if (suggestedPlaces && suggestedPlaces.length > 0) {
        const [[place]] = suggestedPlaces;
        viewDispatch({
          type: "SELECT_PLACE",
          place,
        });
      } else {
        viewDispatch({ type: "SUGGEST_PLACES" });
      }
    }
  }, [viewState, hasRequestedSearch, viewDispatch, suggestedPlaces]);

  const [hasRequestedCentering, setHasRequestedCentering] = React.useState(
    false,
  );
  React.useEffect(() => {
    if (hasLocation(viewState) && hasRequestedCentering) {
      setHasRequestedCentering(false);
      centerView(viewState.location);
    }
  }, [viewState, hasRequestedCentering]);

  const previousViewState = usePrevious(viewState);

  React.useEffect(() => {
    if (location && location !== previousLocation) {
      viewDispatch({ type: "SET_LOCATION", location });
    }
    if (viewState.type === "overviewWithoutLocation" && location !== null) {
      setCenter([location[0], location[1]]);
    } else if (
      viewState.type === "previewPlaceWithoutLocation" &&
      (viewState.type !== (previousViewState ? previousViewState.type : null) ||
        viewState.place !== (previousViewState as any).place)
    ) {
      const { place } = viewState;
      setCenter([place.lng, place.lat]);
    }
  }, [viewState, previousViewState, viewDispatch, location, previousLocation]);

  const unthrottledHeading = useCompassHeading();
  const {
    heading,
    orientationPermissionState,
    requestOrientationPermission,
  } = useThrottle(unthrottledHeading, 20);

  const [
    errorMessage,
    setErrorMessage,
  ] = React.useState<React.ReactNode | null>(null);

  const placeId = hasPlace(viewState) ? viewState.place.id : null;
  const throttledSetDirections = React.useMemo(
    () => throttle(setDirections, 5000),
    [placeId], // eslint-disable-line react-hooks/exhaustive-deps
  );

  React.useEffect(() => {
    if (
      viewState.type === "previewPlace" ||
      viewState.type === "previewPlaceWithRoute" ||
      viewState.type === "navigation"
    ) {
      const [locationLng, locationLat] = viewState.location;
      fetchDirections({ lng: locationLng, lat: locationLat }, viewState.place)
        .then(directions => {
          throttledSetDirections(viewDispatch, directions, viewState.place);
        })
        .catch(() => {
          setErrorMessage("Konnte Route nicht abrufen");
        });
    }
  }, [viewState, viewDispatch, throttledSetDirections]);

  const selectedPlaceId = hasPlace(viewState) ? viewState.place.id : null;

  return (
    <Div100vh
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100rvh",
      }}
    >
      <FacebookWarning />
      <Map
        places={places}
        suggestedPlaces={suggestedPlaces}
        center={center}
        location={location}
        isCentered={selectedPlaceId != null}
        onSelectPlace={placeId => {
          const place = places.find(place => place.id === placeId);
          if (place) {
            setHasRequestedLocation(true);
            viewDispatch({ type: "SELECT_PLACE", place });
          }
        }}
        heading={heading}
      >
        <>
          <Header
            suggestPlaces={() => {
              // if (geolocationPermissionState === "denied") {
              //   setErrorMessage(
              //     <>
              //       Ihr Standort konnte nicht ermittelt werden.
              //       <br />
              //       Zugriff wurde durch Browser verweigert
              //     </>,
              //   );
              //   return;
              // }
              setHasRequestedLocation(true);
              setHasRequestedSearch(true);
            }}
            goToOverview={() => {
              viewDispatch({ type: "GO_TO_OVERVIEW" });
            }}
            geolocationPermissionState={geolocationPermissionState}
            orientationPermissionState={orientationPermissionState}
            requestOrientationPermission={requestOrientationPermission}
          />
          <EmergencyButton />
          <LocationButton
            location={location}
            geolocationPermissionState={geolocationPermissionState}
            setCenter={setCenter}
            requestCentering={() => {
              setHasRequestedLocation(true);
              setHasRequestedCentering(true);
            }}
          />
        </>
        {errorMessage && (
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={() => setErrorMessage(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            style={{ marginTop: 100 }}
          >
            <Alert severity="error" variant="filled" color="warning">
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
        <DebugInfo
          open={false}
          values={{
            state: viewState.type,
            location: (viewState as any).location,
            place: (viewState as any).place,
            directions: (viewState as any).directions,
            selectedPlaceId,
            heading,
            headingGeo: geolocation ? geolocation.coords.heading : undefined,
          }}
        />
      </Map>
      <Drawer>
        <PlaceView
          selectPlace={(placeId: string | null) => {
            const place = places.find(place => place.id === placeId);
            if (place) {
              viewDispatch({ type: "SELECT_PLACE", place });
            } else {
              viewDispatch({ type: "UNSELECT_PLACE" });
            }
          }}
          suggestedPlaces={suggestedPlaces}
          currentTime={currentTime}
          geolocationPermissionState={geolocationPermissionState}
        />
      </Drawer>
    </Div100vh>
  );
}

export default RouteMap;
