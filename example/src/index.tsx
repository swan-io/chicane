import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

const element = document.getElementById("root");

if (element) {
  const root = ReactDOM.createRoot(element);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
