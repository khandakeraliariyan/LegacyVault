import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import Providers from "./app/providers";

import "./styles/globals.css";

import AuthProvider from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);