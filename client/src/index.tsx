import React from "react";
import ReactDOM from "react-dom";
import browserUpdate from "browser-update";

import "./index.css";
import App from "./components/App";
import Sentry from "./api/sentry";
import * as ServiceWorker from "./serviceWorker";

browserUpdate({
  required: {
    i: 12,
  },
  text_for_i: {
    msg:
      "Ihr Browser ({brow_name}) ist veraltet und wird von der EDELGARD map leider nicht unterstützt.",
    msgmore: "Bitte verwenden Sie einen anderen Browser für dieses Angebot.",
  },
});

ServiceWorker.register();

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
if (sentryDsn && process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: sentryDsn });
}

ReactDOM.render(<App />, document.getElementById("root"));
