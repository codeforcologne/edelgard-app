import React from "react";

import { Place } from "../places";
import axios from "axios";

const placesUrl = process.env.REACT_APP_PLACES_URL;

export default function usePlaces(): Place[] {
  const [places, setPlaces] = React.useState<Place[]>([]);

  React.useEffect(() => {
    async function fetchPlaces() {
      if (!placesUrl) {
        throw new Error("Must provide URL to places as REACT_APP_PLACES_URL");
      }

      const response = await axios.get(placesUrl);
      const fetchedPlaces = response.data;
      setPlaces(fetchedPlaces);
    }

    fetchPlaces();
  }, []);

  return places;
}
