import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import PhoneIcon from "@material-ui/icons/Phone";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  emergencyCallButton: {
    marginBottom: theme.spacing(2),
  },
}));

interface EmergencyDialogProps {
  handleClose: () => void;
}

export default function EmergencyDialog({ handleClose }: EmergencyDialogProps) {
  const classes = useStyles();

  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">Notruf wählen?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Button
            href="tel:110"
            variant="contained"
            color="primary"
            startIcon={<PhoneIcon />}
            className={classes.emergencyCallButton}
          >
            Polizei-Notruf 110
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  );
}
