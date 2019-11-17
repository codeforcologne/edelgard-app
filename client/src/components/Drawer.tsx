import React from "react";

import Drawer from "@material-ui/core/Drawer";

import { useViewState, useViewDispatch } from "./ViewContext";
import { hasPlace } from "../hooks/useViewReducer";
import { ClickAwayListener } from "@material-ui/core";

interface DrawerProps {
  children: React.ReactNode;
}

export default ({ children }: DrawerProps): JSX.Element => {
  const viewState = useViewState();
  const viewDispatch = useViewDispatch();

  const drawerIsOpen =
    viewState.type === "suggestingPlaces" || hasPlace(viewState);

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (viewState.type === "suggestingPlaces") {
          viewDispatch({ type: "GO_TO_OVERVIEW" });
        }
      }}
    >
      <Drawer anchor="bottom" open={drawerIsOpen} variant="persistent">
        {children}
      </Drawer>
    </ClickAwayListener>
  );
};
