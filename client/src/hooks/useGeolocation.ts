import { useEffect, useState } from "react";
import Sentry from "../api/sentry";

const useGeolocation = (
  { enableHighAccuracy, maximumAge, timeout }: PositionOptions = {},
  callback: (coordinates: Coordinates) => void = () => {},
  requestGeolocation: boolean = true,
): Position | undefined => {
  const [position, setPosition] = useState<Position>();
  const [error, setError] = useState<PositionError>();
  if (error) {
    console.error(error);
    Sentry.withScope(scope => {
      scope.setExtra("error.code", error.code);
      scope.setExtra("error.message", error.message);
      Sentry.captureException(error);
    });
  }

  useEffect(() => {
    let watchId: number | undefined;
    if (navigator.geolocation && requestGeolocation) {
      navigator.geolocation.getCurrentPosition(setPosition, setError);
      watchId = navigator.geolocation.watchPosition(setPosition, setError, {
        enableHighAccuracy,
        maximumAge,
        timeout,
      });
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enableHighAccuracy, maximumAge, timeout, requestGeolocation]);

  return position;
};

export default useGeolocation;
