import React from "react";
import { Layer, Feature } from "react-mapbox-gl";

import images from "./images";
import { LngLat } from "../../places";

interface LocationLayersProps {
  location: LngLat | null;
  isCentered: boolean;
  heading: number | null;
}

export default function LocationLayers({
  location,
  isCentered,
  heading,
}: LocationLayersProps) {
  return (
    <>
      <Layer
        type="symbol"
        layout={{
          "icon-image": "icon-cone",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-rotate": heading || 0,
        }}
        paint={{
          "icon-opacity": 0.75,
        }}
        images={images}
      >
        {heading !== null && isCentered && location && (
          <Feature coordinates={location} />
        )}
      </Layer>
      <Layer
        type="symbol"
        layout={{
          "icon-image": "icon-cone-gray",
          "icon-size": 0.5,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-rotate": heading || 0,
        }}
        paint={{
          "icon-opacity": 0.75,
        }}
        images={images}
      >
        {heading !== null && !isCentered && location && (
          <Feature coordinates={location} />
        )}
      </Layer>
      <Layer
        type="circle"
        paint={{
          "circle-stroke-width": 4,
          "circle-radius": 10,
          "circle-color": "hsl(215, 60%, 50%)",
          "circle-stroke-color": "white",
        }}
      >
        {isCentered && location && <Feature coordinates={location} />}
      </Layer>
      <Layer
        type="circle"
        paint={{
          "circle-stroke-width": 4,
          "circle-radius": 10,
          "circle-color": "hsl(0, 0%, 70%)",
          "circle-stroke-color": "white",
        }}
      >
        {!isCentered && location && <Feature coordinates={location} />}
      </Layer>
    </>
  );
}
