import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./components/App";
import Sentry from "./api/sentry";
import * as ServiceWorker from "./serviceWorker";

ServiceWorker.register();

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
if (sentryDsn && process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: sentryDsn });
}

ReactDOM.render(<App />, document.getElementById("root"));
