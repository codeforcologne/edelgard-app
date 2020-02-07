import { useState, useEffect, useMemo, useCallback } from "react";

type DeviceOrientationEventWebkit = DeviceOrientationEvent & {
  webkitCompassHeading: number;
};

const radiansPerDegree = Math.PI / 180;

function compassHeadingFromAngles(
  alpha: number,
  beta: number,
  gamma: number,
): number | null {
  // Based on https://www.w3.org/TR/orientation-event/#worked-example

  const x = beta * radiansPerDegree;
  const y = gamma * radiansPerDegree;
  const z = alpha * radiansPerDegree;

  const { sin, cos } = Math;

  // Calculate Vx and Vy components
  var Vx = -cos(z) * sin(y) - sin(z) * sin(x) * cos(y);
  var Vy = -sin(z) * sin(y) + cos(z) * sin(x) * cos(y);

  if (Vy === 0) {
    return null;
  }

  // Calculate compass heading
  let compassHeadingRadians = Math.atan(Vx / Vy);

  // Convert compass heading to use whole unit circle
  if (Vy < 0) {
    compassHeadingRadians += Math.PI;
  } else if (Vx < 0) {
    compassHeadingRadians += 2 * Math.PI;
  }

  const compassHeadingDegrees = compassHeadingRadians / radiansPerDegree;

  return compassHeadingDegrees;
}

function compassHeadingFromEvent(
  event: DeviceOrientationEvent | DeviceOrientationEventWebkit,
): number | null {
  if ("webkitCompassHeading" in event && event.webkitCompassHeading >= 0) {
    return event.webkitCompassHeading;
  }

  if (
    event.absolute &&
    event.alpha !== null &&
    event.beta !== null &&
    event.gamma !== null
  ) {
    return compassHeadingFromAngles(event.alpha, event.beta, event.gamma);
  }

  return null;
}

// iOS 13+
const requestPermissionExists =
  typeof DeviceOrientationEvent !== "undefined" &&
  typeof (DeviceOrientationEvent as any).requestPermission === "function";

export default function useCompassHeading(): {
  heading: number | null;
  orientationPermissionState: string | undefined;
  requestOrientationPermission: () => void;
} {
  const [heading, setHeading] = useState<number | null>(null);

  // iOS 13+
  const [orientationPermissionState, setOrientationPermissionState] = useState<
    string | undefined
  >(requestPermissionExists ? "not-checked" : "not-required");
  const requestOrientationPermission = useCallback(() => {
    (DeviceOrientationEvent as any)
      .requestPermission()
      .then(setOrientationPermissionState)
      .catch((error: any) => {
        // Permission hasn't yet been granted or denied
        // and this function was not called from a user action.
        // We need to show a button for requesting the permission.
        setOrientationPermissionState("required");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (
      requestPermissionExists &&
      orientationPermissionState === "not-checked"
    ) {
      // iOS 13+
      setOrientationPermissionState("checking");
      requestOrientationPermission();
    }

    const handleEvent = (
      event: DeviceOrientationEvent | DeviceOrientationEventWebkit,
    ) => {
      setHeading(compassHeadingFromEvent(event));
    };

    if ("ondeviceorientationabsolute" in window) {
      // We can listen for the new deviceorientationabsolute event.
      window.addEventListener("deviceorientationabsolute", handleEvent, false);
      return () => {
        window.removeEventListener("deviceorientationabsolute", handleEvent);
      };
    } else if ("ondeviceorientation" in window) {
      // We can still listen for deviceorientation events.
      // The `absolute` property of the event tells us whether
      // or not the degrees are absolute.
      window.addEventListener("deviceorientation", handleEvent, false);
      return () => {
        window.removeEventListener("deviceorientation", handleEvent);
      };
    }
  }, [orientationPermissionState]);

  const result = useMemo(
    () => ({
      heading,
      orientationPermissionState,
      requestOrientationPermission,
    }),
    [heading, orientationPermissionState, requestOrientationPermission],
  );
  return result;
}
