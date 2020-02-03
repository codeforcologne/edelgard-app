import React, { Dispatch, SetStateAction } from "react";

import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";

interface HelpDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  anchorEl: HTMLButtonElement | undefined;
  deferredPrompt: any | null;
  clearDeferredPrompt: () => void;
}

export default function HelpMenu({
  open,
  setOpen,
  anchorEl,
  deferredPrompt,
  clearDeferredPrompt,
}: HelpDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  const showInstallationPrompt = () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      clearDeferredPrompt();
    }, console.warn);
  };

  return (
    <Popper open={open} anchorEl={anchorEl} transition disablePortal>
      {() => (
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList>
              {deferredPrompt && (
                <>
                  <MenuItem onClick={showInstallationPrompt}>
                    Als App installieren
                  </MenuItem>
                  <Divider />
                </>
              )}
              <MenuItem
                component="a"
                href="https://edelgard.koeln"
                target="_blank"
                rel="noopener noreferrer"
              >
                edelgard.koeln
              </MenuItem>
              <Divider />
              <MenuItem component="a" href="mailto:info@edelgard.koeln">
                Feedback senden
              </MenuItem>
              <Divider />
              <MenuItem
                component="a"
                href="https://edelgard.koeln/impressum"
                target="_blank"
                rel="noopener noreferrer"
              >
                Impressum
              </MenuItem>
              <Divider />
              <MenuItem
                component="a"
                href="https://edelgard.koeln/datenschutzerklaerung"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      )}
    </Popper>
  );
}
