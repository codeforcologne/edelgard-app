import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default function FacebookWarning() {
  function isFacebookApp() {
    var ua = navigator.userAgent || navigator.vendor;
    return (
      typeof ua === "string" &&
      (ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1)
    );
  }

  const [showWarning, setShowWarning] = React.useState(false);
  React.useEffect(() => {
    if (isFacebookApp()) {
      setShowWarning(true);
    }
  }, []);

  const closeWarning = () => setShowWarning(false);

  return (
    <Dialog
      open={showWarning}
      onClose={closeWarning}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Facebook Mobile Browser</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Dieser Browser kann Ihren Standort nicht ermitteln. Bitte nutzen Sie
          das Browser-Menü, um die EDELGARD map in einem anderen Browser wie{" "}
          <strong>Chrome</strong> bzw. <strong>Safari</strong> zu öffnen.
          <img
            src="https://edelgard-api-test.netlify.com/assets/facebook_safari.png"
            alt="Screenshot des Menüs"
            style={{ display: "block", marginTop: 10, width: "100%" }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeWarning} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
