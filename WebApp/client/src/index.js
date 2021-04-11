import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { globalStyles } from "./misc/GlobalStyles";
import { ThemeProvider } from "@material-ui/core/styles";
import history from "./history";
import { Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={globalStyles}>
      <Router history={history}>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
