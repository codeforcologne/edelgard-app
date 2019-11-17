import React from "react";

import RouteMap from "./MainView";
import { ViewProvider } from "./ViewContext";

export default function App() {
  return (
    <ViewProvider>
      <RouteMap />
    </ViewProvider>
  );
}
