import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add debugging logs
console.log("Main.tsx: Starting application");
console.log("Main.tsx: CSS loaded");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Main.tsx: Root element not found");
} else {
  console.log("Main.tsx: Root element found, rendering app");
  createRoot(rootElement).render(<App />);
}