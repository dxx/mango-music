import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Root from "./components/Root";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();

if (module.hot) {
  module.hot.accept("./components/Root", () => {
    const NewApp = require("./components/Root").default;
    ReactDOM.render(<NewApp />, document.getElementById("root"));
  });
}
