import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function DisclaimerDialog() {
  const storageKey = "hasConfirmedTestDisclaimer";
  const [
    hasConfirmedTestDisclaimer,
    setHasConfirmedTestDisclaimer,
  ] = React.useState<boolean>(
    () => window.localStorage.getItem(storageKey) === "true",
  );

  React.useEffect(() => {
    window.localStorage.setItem(storageKey, String(hasConfirmedTestDisclaimer));
  }, [hasConfirmedTestDisclaimer]);

  const handleClose = () => {
    setHasConfirmedTestDisclaimer(true);
  };

  return (
    <Dialog
      open={!hasConfirmedTestDisclaimer}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="disclaimer"
    >
      <DialogTitle id="alert-dialog-title">Hinweis</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Diese App ist ein <strong>Prototyp</strong> und verwendet Testdaten.
          Sie ist noch nicht für den Ernstfall geeignet.
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
