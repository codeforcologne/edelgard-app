import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function DisclaimerDialog() {
  const [
    hasConfirmedDisclaimer,
    setHasConfirmedDisclaimer,
  ] = React.useState<boolean>(false);

  const handleClose = () => {
    setHasConfirmedDisclaimer(true);
  };

  return (
    <Dialog
      open={!hasConfirmedDisclaimer}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Hinweis</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Leider sind fast alle unserer{" "}
          <span
            style={{
              fontFamily:
                '"Open Sans Condensed", Helvetica, Arial, Verdana, sans-serif',
              color: "black",
            }}
          >
            EDELGARD schützt
          </span>{" "}
          Orte zurzeit geschlossen und können euch nicht den gewohnten Schutz
          bieten. Die aktuellen Öffnungszeiten können wir angesichts der rapiden
          Entwicklung leider nicht pflegen.
          <br />
          Passt auf euch auf und wählt im Zweifel bitte den Notruf 110.
          <br />
          <br />
          An Silvester ist die{" "}
          <span
            style={{
              fontFamily:
                '"Open Sans Condensed", Helvetica, Arial, Verdana, sans-serif',
              color: "black",
            }}
          >
            EDELGARD mobil
          </span>{" "}
          Hotline von 22 bis 1 Uhr für Euch erreichbar. Telefon{" "}
          <a
            href="tel:+4922122127777"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            0221 / 221-27777
          </a>
          .
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
