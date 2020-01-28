import React from "react";

import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@material-ui/icons/Help";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import { useViewState } from "./ViewContext";
import HelpMenu from "./HelpMenu";

const logoUrl = process.env.REACT_APP_LOGO_URL;

const useStyles = makeStyles({
  appBar: {
    position: "absolute",
  },
  logo: {
    marginRight: 6,
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
  searchButton: {
    whiteSpace: "nowrap",
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

  const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);

  const anchorRef = React.useRef();

  return (
    <AppBar
      position="static"
      color={isSearching ? "secondary" : "inherit"}
      className={classes.appBar}
    >
      <Toolbar>
        <img src={logoUrl} alt="EDELGARD-Logo" className={classes.logo} />
        <Typography variant="h3" color="inherit" className={classes.title}>
          EDELGARD <span className={classes.titleAddition}>map</span>
        </Typography>
        {isSearching ? (
          <Button
            title="Zurück zur Karte"
            variant="outlined"
            color="inherit"
            onClick={goToOverview}
          >
            <CloseIcon />
          </Button>
        ) : (
          <>
            <IconButton
              aria-label="Hilfe"
              onClick={() => setIsHelpMenuOpen(true)}
              ref={anchorRef as any}
            >
              <HelpIcon />
            </IconButton>
            <HelpMenu
              open={isHelpMenuOpen}
              setOpen={setIsHelpMenuOpen}
              anchorEl={anchorRef.current}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={suggestPlaces}
              disabled={geolocationPermissionState === "denied"}
              className={classes.searchButton}
            >
              Schutz suchen
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
