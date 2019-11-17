import React from "react";

import CloseIcon from "@material-ui/icons/Close";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { useViewState } from "./ViewContext";

const logoUrl = process.env.REACT_APP_LOGO_URL;

const useStyles = makeStyles({
  appBar: {
    position: "absolute",
  },
  logo: {
    marginRight: 16,
    height: 48,
  },
  title: {
    flexGrow: 1,
    font:
      'normal 300 18px / 25px "Open Sans Condensed", Helvetica, Arial, Verdana, sans-serif',
    textTransform: "uppercase",
  },
  titleAddition: {
    fontWeight: "bold",
    fontSize: "0.8em",
  },
});

interface HeaderProps {
  suggestPlaces: () => void;
  goToOverview: () => void;
  geolocationPermissionState: PermissionState | undefined;
}

export default ({
  suggestPlaces,
  goToOverview,
  geolocationPermissionState,
}: HeaderProps) => {
  const viewState = useViewState();

  const isSearching =
    viewState.type === "suggestingPlaces" ||
    viewState.type === "previewPlaceWithoutLocation" ||
    viewState.type === "previewPlace" ||
    viewState.type === "previewPlaceWithRoute";

  const classes = useStyles();

  return (
    <AppBar
      position="static"
      color={isSearching ? "secondary" : "inherit"}
      className={classes.appBar}
    >
      <Toolbar>
        <img src={logoUrl} alt="Edelgard-Logo" className={classes.logo} />
        <Typography variant="h3" color="inherit" className={classes.title}>
          Edelgard <span className={classes.titleAddition}>Test</span>
        </Typography>
        {isSearching ? (
          <Button variant="outlined" color="inherit" onClick={goToOverview}>
            <CloseIcon />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={suggestPlaces}
            disabled={geolocationPermissionState === "denied"}
          >
            Schutz suchen
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
