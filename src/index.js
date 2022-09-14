import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import { Provider } from "react-redux";
import store from "./services/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";

import AlertTemplate from "react-alert-template-basic";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
const theme = createMuiTheme({
  typography: {
    fontFamily: "Montserrat, sans-serif",
  },
  overrides: {
    MuiTableCell: {
      root: {
        //This can be referred from Material UI API documentation.
        padding: "4px 15px",
      },
    },
  },
});

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT,
  transition: transitions.SCALE,
};
window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AlertProvider>
  </Provider>,
  document.getElementById("root")
);
