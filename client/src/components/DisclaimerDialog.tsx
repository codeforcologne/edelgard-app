import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function DisclaimerDialog() {
  const [hasConfirmedDisclaimer, setHasConfirmedDisclaimer] = React.useState<
    boolean
  >(false);

  const handleClose = () => {
    setHasConfirmedDisclaimer(true);
  };

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
          Das <strong>EDELGARD mobil</strong> ist am 11.11. #diesmalnicht im
          Einsatz.
          <br />
          Wir sind am 11.11.2020 von 14 bis 1 Uhr per Telefon erreichbar.
          <br />
          Hotline: <a href="tel:+4922122127777">0221 / 221-27777</a>.{" "}
          <a href="https://edelgard.koeln/edelgard-schuetzt-und-mobil/#termine">
            www.edelgard.koeln
          </a>
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
