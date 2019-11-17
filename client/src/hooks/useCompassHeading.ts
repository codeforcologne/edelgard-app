import { useState, useEffect } from "react";

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

export default function useCompassHeading() {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
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
  }, []);

  return heading;
}
