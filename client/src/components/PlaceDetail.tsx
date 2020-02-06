import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import TimerIconOutlined from "@material-ui/icons/TimerOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import { Place } from "../places";
import { Directions } from "./Map";
import PlaceAdditionalInformation from "./PlaceAdditionalInformation";
import { useViewDispatch } from "./ViewContext";

const useStyles = makeStyles({
  list: {
    padding: 0,
    overflow: "hidden",
  },
  listItem: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  primaryText: {
    textOverflow: "ellipsis",
  },
  duration: {
    fontWeight: "bold",
    color: "#3f51b5",
  },
  placeImage: {
    width: "120px",
    height: "110px",
    margin: "-24px -16px -24px 0",
    objectFit: "cover",
    boxShadow: "-10px 0px 20px 10px rgba(255,255,255,1)",
  },
});

interface PlaceDetailProps {
  place: Place;
  currentTime: Date;
  directions: Directions | null;
  geolocationPermissionState: PermissionState | undefined;
}

export default function PlaceDetail({
  place,
  currentTime,
  directions,
  geolocationPermissionState,
}: PlaceDetailProps): JSX.Element {
  const viewDispatch = useViewDispatch();

  const classes = useStyles();

  const duration =
    directions &&
    directions.routes &&
    directions.routes.length > 0 &&
    directions.routes[0].duration;

  let durationOutput: string | undefined;
  if (duration) {
    if (duration < 60) {
      durationOutput = `${Math.ceil(duration / 10) * 10} s`;
    } else {
      durationOutput = `${Math.round(duration / 60)} min`;
    }
  }

  return (
    <>
      <List className={classes.list}>
        <ListItem alignItems="flex-start" className={classes.listItem}>
          <ListItemText
            primary={
              <div className={classes.primaryText}>
                {durationOutput && (
                  <>
                    <span className={classes.duration}>
                      <TimerIconOutlined
                        color="primary"
                        fontSize="small"
                        style={{ marginBottom: -4 }}
                      />{" "}
                      {durationOutput}
                    </span>{" "}
                    -{" "}
                  </>
                )}
                {place.title}
              </div>
            }
            secondary={
              <PlaceAdditionalInformation
                place={place}
                currentTime={currentTime}
              />
            }
          />
          {place.imageUrl && (
            <ListItemAvatar style={{ overflow: "unset" }}>
              <img
                src={place.imageUrl}
                alt="Außenansicht"
                className={classes.placeImage}
              />
            </ListItemAvatar>
          )}
        </ListItem>
        <Divider />
      </List>
      <Box display="flex" justifyContent="center" p={1}>
        <Button
          onClick={() => viewDispatch({ type: "SUGGEST_PLACES" })}
          fullWidth
          disabled={geolocationPermissionState !== "granted"}
        >
          Weitere Orte
          <ExpandMoreIcon />
        </Button>
      </Box>
    </>
  );
}
