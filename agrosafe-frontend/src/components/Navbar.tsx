import React from "react";
import ConnectButton from "./ConnectButton";

export default function Navbar({ setRoute }: { setRoute: (r: string) => void }) {
    return (
        <header className="flex justify-between items-center p-4 bg-white shadow">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">AgroSafe</h1>
                <nav className="space-x-3">
                    <button onClick={() => setRoute("dashboard")} className="link">Dashboard</button>
                    <button onClick={() => setRoute("register")} className="link">Register</button>
                    <button onClick={() => setRoute("produce")} className="link">Produce</button>
                    <button onClick={() => setRoute("admin")} className="link">Admin</button>
                    <button onClick={() => setRoute("trace")} className="link">Trace</button>
                </nav>
            </div>
            <ConnectButton />
        </header>
    );
}
