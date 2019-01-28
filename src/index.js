import React from "react"
import ReactDOM from "react-dom"
import Root from "./views/Root"
import registerServiceWorker from "./registerServiceWorker"
import "./index.css"

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();

if (module.hot) {
  module.hot.accept("./views/Root", () => {
    const NewApp = require("./views/Root").default;
    ReactDOM.render(<NewApp />, document.getElementById("root"));
  });
}
