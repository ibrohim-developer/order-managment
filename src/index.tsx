import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import { createTheme } from "./common/theme";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider
          theme={createTheme({
            direction: "ltr",
            responsiveFontSizes: true,
          })}
        >
          <LocalizationProvider
            dateAdapter={AdapterLuxon}
          >
            <App />
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
