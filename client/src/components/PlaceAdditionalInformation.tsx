import React from "react";

import { getOpenState, relativeDistance } from "../hours";
import { Place } from "../places";

interface PlaceAdditionalInformationProps {
  place: Place;
  currentTime: Date;
}

export default function PlaceAdditionalInformation({
  place,
  currentTime,
}: PlaceAdditionalInformationProps): JSX.Element {
  const { state: currentlyOpen, nextOpenOrClose } = getOpenState(
    place.hours,
    currentTime,
  );
  return (
    <>
      {place.address.replace(/(, \d+,? Köln)?, Deutschland$/, "")}
      <br />
      <span>
        <span
          style={{ fontWeight: "bold", color: currentlyOpen ? "unset" : "red" }}
        >
          {currentlyOpen ? "Geöffnet" : "Geschlossen"}
        </span>{" "}
        {nextOpenOrClose ? (
          <>
            - {currentlyOpen ? "schließt" : "öffnet"}{" "}
            {relativeDistance(nextOpenOrClose, currentTime)}
          </>
        ) : (
          !currentlyOpen && "- öffnet heute nicht"
        )}
      </span>
    </>
  );
}
