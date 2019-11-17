import React from "react";

import useCurrentMinute from "../hooks/useCurrentMinute";

const CurrentTimeContext = React.createContext<Date | undefined>(undefined);

interface TimeProviderProps {
  children: React.ReactNode;
}

function TimeProvider({ children }: TimeProviderProps): JSX.Element {
  const currentTime = useCurrentMinute();

  return (
    <CurrentTimeContext.Provider value={currentTime}>
      {children}
    </CurrentTimeContext.Provider>
  );
}

function useCurrentTime() {
  const context = React.useContext(CurrentTimeContext);
  if (context === undefined) {
    throw new Error("useCurrentTime must be used within a TimeProvider");
  }
  return context;
}

export { TimeProvider, useCurrentTime };
