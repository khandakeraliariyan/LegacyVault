import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import Providers from "./app/providers";

import "./styles/globals.css";

import AuthProvider from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Providers>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Providers>
  </React.StrictMode>
);
