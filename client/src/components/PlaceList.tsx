import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";

import { format } from "date-fns";

import {
  getOpenState,
  getDayIntervals,
  Interval,
  relativeDistance,
} from "../hours";

import { Place } from "../places";

interface PlaceListProps {
  places: [Place, number][];
  setSelectedPlaceId: (placeId: string | null) => void;
  currentTime: Date;
}

export default function PlaceList({
  places,
  setSelectedPlaceId,
  currentTime,
}: PlaceListProps): JSX.Element {
  return (
    <List>
      {places.map(([foundPlace, distance], index) => (
        <React.Fragment key={foundPlace.id}>
          {index !== 0 && <Divider />}
          <ListItem
            alignItems="flex-start"
            button
            onClick={() => {
              setSelectedPlaceId(foundPlace.id);
            }}
          >
            <ListItemText
              primary={
                <span style={{ whiteSpace: "nowrap" }}>{foundPlace.title}</span>
              }
              secondary={(() => {
                const { state, nextOpenOrClose } = getOpenState(
                  foundPlace.hours,
                  currentTime,
                );
                const intervals: Interval[] = getDayIntervals(
                  foundPlace.hours,
                  new Date(),
                );
                return (
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {state ? "Geöffnet" : "Geschlossen"}
                    </Typography>{" "}
                    -{" "}
                    {nextOpenOrClose && (
                      <>
                        {state ? "schließt" : "öffnet"}{" "}
                        {relativeDistance(nextOpenOrClose, currentTime)}
                        <br />
                        {intervals.length > 0 ? (
                          <>
                            Heute geöffnet{" "}
                            {intervals
                              .map(
                                ([from, to]) =>
                                  `${format(from, "HH:mm")}–${format(
                                    to,
                                    "HH:mm",
                                  )}`,
                              )
                              .join(", ")}
                          </>
                        ) : (
                          "Heute nicht geöffnet"
                        )}
                      </>
                    )}
                  </>
                );
              })()}
            />
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setSelectedPlaceId(foundPlace.id);
                }}
                style={{
                  boxShadow: "0px 0px 10px 10px rgba(255,255,255,1)",
                }}
              >
                {Math.round(distance / 10) * 10} m{" "}
                <DirectionsWalkIcon
                  style={{ marginLeft: 4, marginRight: -4 }}
                />
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
}
