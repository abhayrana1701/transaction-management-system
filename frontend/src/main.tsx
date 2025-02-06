import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeContextProvider } from "./context/theme.context";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { ToastContainer } from "react-toastify";
import './i18n/i18n'; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider >
        <Provider store={store}>
          <ToastContainer aria-label={""}/>
          <App />
        </Provider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode> 
);