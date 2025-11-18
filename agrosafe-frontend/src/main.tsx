import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WagmiReownProvider } from "./providers/WagmiReownProvider";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <WagmiReownProvider>
            <App />
        </WagmiReownProvider>
    </React.StrictMode>
);