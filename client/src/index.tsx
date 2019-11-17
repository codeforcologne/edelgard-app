import React from "react";
import ReactDOM from "react-dom";

import * as Sentry from "@sentry/browser";

import "./index.css";
import App from "./components/App";

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
if (sentryDsn && process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: sentryDsn });
}

ReactDOM.render(<App />, document.getElementById("root"));
