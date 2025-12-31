import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WagmiReownProvider } from "./providers/WagmiReownProvider";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
    <React.StrictMode>
        <WagmiReownProvider>
            <App />
        </WagmiReownProvider>
    </React.StrictMode>
);