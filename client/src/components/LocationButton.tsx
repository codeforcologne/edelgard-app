import React from "react";

import Fab from "@material-ui/core/Fab";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import LocationDisabledIcon from "@material-ui/icons/LocationDisabled";
import { makeStyles } from "@material-ui/core/styles";

import { LngLat } from "../places";

const useStyles = makeStyles(theme => ({
  locationButton: {
    position: "absolute",
    bottom: theme.spacing(6),
    right: theme.spacing(2),
  },
}));

interface LocationButtonProps {
  location: LngLat | null;
  geolocationPermissionState: PermissionState | undefined;
  setCenter: (center: LngLat) => void;
  requestCentering: () => void;
}

export default function LocationButton({
  geolocationPermissionState: geolocationPermission,
  requestCentering,
}: LocationButtonProps) {
  const classes = useStyles();
  const iconByState = {
    granted: <MyLocationIcon />,
    prompt: <LocationSearchingIcon />,
    denied: <LocationDisabledIcon />,
  };
  const icon = iconByState[geolocationPermission || "prompt"];
  return (
    <Fab
      aria-label="Go to my location"
      color="default"
      className={classes.locationButton}
      disabled={geolocationPermission === "denied"}
      onClick={requestCentering}
    >
      {icon}
    </Fab>
  );
}
