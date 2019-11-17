import React from "react";

import useViewReducer, {
  ViewState,
  ViewStateAction,
} from "../hooks/useViewReducer";

const ViewStateContext = React.createContext<ViewState | undefined>(undefined);

const ViewDispatchContext = React.createContext<
  React.Dispatch<ViewStateAction> | undefined
>(undefined);

interface ViewProviderProps {
  children: React.ReactNode;
}

function ViewProvider({ children }: ViewProviderProps): JSX.Element {
  const [state, dispatch] = useViewReducer();

  return (
    <ViewStateContext.Provider value={state}>
      <ViewDispatchContext.Provider value={dispatch}>
        {children}
      </ViewDispatchContext.Provider>
    </ViewStateContext.Provider>
  );
}

function useViewState() {
  const context = React.useContext(ViewStateContext);
  if (context === undefined) {
    throw new Error("useViewState must be used within a ViewProvider");
  }
  return context;
}

function useViewDispatch() {
  const context = React.useContext(ViewDispatchContext);
  if (context === undefined) {
    throw new Error("useViewDispatch must be used within a ViewProvider");
  }
  return context;
}

export { ViewProvider, useViewState, useViewDispatch };
