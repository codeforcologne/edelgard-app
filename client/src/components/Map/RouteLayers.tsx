import React from "react";
import { Layer, Feature } from "react-mapbox-gl";

import { Directions } from "./index";

interface RouteLayersProps {
  directions?: Directions;
}

export default function RouteLayers({ directions }: RouteLayersProps) {
  return (
    <>
      <Layer
        type="line"
        paint={{
          "line-width": 8,
          "line-color": "hsl(215, 60%, 50%)",
          "line-dasharray": [0, 2],
        }}
        layout={{
          "line-cap": "round",
          "line-join": "round",
        }}
      >
        {directions &&
          directions.routes &&
          directions.routes
            .slice(0, 1)
            .map((route, index) => (
              <Feature coordinates={route.geometry.coordinates} key={index} />
            ))}
      </Layer>
    </>
  );
}
