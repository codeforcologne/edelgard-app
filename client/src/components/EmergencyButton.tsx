import React from "react";

import Fab from "@material-ui/core/Fab";
import SvgIcon from "@material-ui/core/SvgIcon";
import { makeStyles } from "@material-ui/core/styles";
import EmergencyDialog from "./EmergencyDialog";

const useStyles = makeStyles(theme => ({
  emergencyDialogButton: {
    position: "absolute",
    top: theme.spacing(10),
    right: theme.spacing(2),
  },
  "@media (min-width: 1024px), (min-height: 1024px)": {
    emergencyDialogButton: {
      display: "none",
    },
  },
}));

export default function EmergencyButton() {
  const classes = useStyles();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      <Fab
        aria-label="Polizei-Notruf wählen"
        color="primary"
        variant="extended"
        className={classes.emergencyDialogButton}
        onClick={() => setIsDialogOpen(true)}
      >
        <SvgIcon viewBox="0 0 26 23" fontSize="large">
          <g>
            <path d="M20 15.5C18.75 15.5 17.55 15.3 16.43 14.93C16.08 14.82 15.69 14.9 15.41 15.17L13.21 17.37C10.38 15.93 8.06 13.62 6.62 10.79L8.82 8.58C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.5C21 15.95 20.55 15.5 20 15.5Z" />
            {/* <path d="M12 11H21L16.5 3L12 11ZM16.9091 9.73684H16.0909V8.89474H16.9091V9.73684ZM16.9091 8.05263H16.0909V6.36842H16.9091V8.05263Z" /> */}
            <text x="11" y="10" style={{ font: "bold 8px Arial, sans-serif" }}>
              110
            </text>
          </g>
        </SvgIcon>
      </Fab>
      {isDialogOpen && (
        <EmergencyDialog handleClose={() => setIsDialogOpen(false)} />
      )}
    </>
  );
}
