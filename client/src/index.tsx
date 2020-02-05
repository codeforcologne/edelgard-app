import React from "react";
import ReactDOM from "react-dom";

import * as Sentry from "@sentry/browser";

import "./index.css";
import App from "./components/App";
import * as ServiceWorker from "./serviceWorker";

ServiceWorker.register();

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
if (sentryDsn && process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: sentryDsn });
}

export { Sentry };

ReactDOM.render(<App />, document.getElementById("root"));
