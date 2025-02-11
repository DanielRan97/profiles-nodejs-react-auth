import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/authContext";
import { BrowserRouter } from "react-router-dom";
import { ChatProvider } from "./contexts/chatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();
