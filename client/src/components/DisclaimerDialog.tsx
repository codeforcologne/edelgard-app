import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  edelgardTypography: {
    fontFamily: '"Open Sans Condensed", Helvetica, Arial, Verdana, sans-serif',
    color: "black",
  },
  link: {
    color: theme.palette.secondary.main,
  },
}));

export default function DisclaimerDialog() {
  const [
    hasConfirmedDisclaimer,
    setHasConfirmedDisclaimer,
  ] = React.useState<boolean>(false);

  const handleClose = () => {
    setHasConfirmedDisclaimer(true);
  };

  const classes = useStyles();

  return (
    <Dialog
      open={!hasConfirmedDisclaimer}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="disclaimer"
    >
      <DialogTitle id="alert-dialog-title">Hinweis</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Leider sind durch die coronabedingten Einschränkungen einige unserer{" "}
          <span className={classes.edelgardTypography}>EDELGARD schützt</span>{" "}
          Orte vorübergehend anders oder gar nicht geöffnet. Im Notfall könnt
          ihr auch – je nach Situation – Passant*innen ansprechen oder in
          irgendeinem geöffneten Laden in der Nähe um Hilfe bitten.
          <br />
          Wenn ihr dann nicht mehr alleine und/oder an einem geschützten Ort
          seid, könnt ihr das Hilfetelefon Gewalt gegen Frauen anrufen (24/7
          kostenlos unter{" "}
          <a href="tel:+498000116016" className={classes.link}>
            08000 116 016
          </a>{" "}
          erreichbar) und mit den Beraterinnen die nächsten Schritte besprechen.
          Wenn ihr eine Anzeige machen wollt, ruft bitte direkt die Polizei (
          <a href="tel:110" className={classes.link}>
            110
          </a>
          ) an.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
