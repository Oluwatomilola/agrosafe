import React from "react";
import ConnectButton from "./ConnectButton";

interface NavbarProps {
    setRoute: (route: string) => void;
}

/**
 * Navigation bar component for the AgroSafe application
 * Provides routing functionality and wallet connection
 */
export default function Navbar({ setRoute }: NavbarProps) {
    const handleRouteChange = (route: string) => {
        setRoute(route);
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow" role="banner">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold" aria-label="AgroSafe Application">AgroSafe</h1>
                <nav className="space-x-3" role="navigation" aria-label="Main navigation">
                    <button 
                        onClick={() => handleRouteChange("dashboard")} 
                        className="link"
                        aria-label="Go to Dashboard"
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => handleRouteChange("register")} 
                        className="link"
                        aria-label="Go to Farmer Registration"
                    >
                        Register
                    </button>
                    <button 
                        onClick={() => handleRouteChange("produce")} 
                        className="link"
                        aria-label="Go to Produce Management"
                    >
                        Produce
                    </button>
                    <button 
                        onClick={() => handleRouteChange("admin")} 
                        className="link"
                        aria-label="Go to Admin Panel"
                    >
                        Admin
                    </button>
                    <button 
                        onClick={() => handleRouteChange("trace")} 
                        className="link"
                        aria-label="Go to Traceability"
                    >
                        Trace
                    </button>
                </nav>
            </div>
            <ConnectButton />
        </header>
    );
}
