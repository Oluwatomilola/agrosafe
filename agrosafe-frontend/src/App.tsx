import React from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FarmerRegister from "./pages/FarmerRegister";
import Produce from "./pages/Produce";
import Admin from "./pages/Admin";
import Trace from "./pages/Trace";

export default function App() {
    const [route, setRoute] = React.useState("dashboard");
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar setRoute={setRoute} />
            <main className="p-6">
                {route === "dashboard" && <Dashboard />}
                {route === "register" && <FarmerRegister />}
                {route === "produce" && <Produce />}
                {route === "admin" && <Admin />}
                {route === "trace" && <Trace />}
            </main>
        </div>
    );
}
