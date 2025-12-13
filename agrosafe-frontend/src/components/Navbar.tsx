import React from 'react';
import { WalletConnect } from './WalletConnect';

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
export default function Navbar({ setRoute }: { setRoute: (r: string) => void }) {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold">AgroSafe</h1>
        <nav className="space-x-3">
          <button
            onClick={() => setRoute('dashboard')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Dashboard
          </button>
          <button
            onClick={() => setRoute('register')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Register
          </button>
          <button
            onClick={() => setRoute('produce')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Produce
          </button>
          <button
            onClick={() => setRoute('admin')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Admin
          </button>
          <button
            onClick={() => setRoute('trace')}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Trace
          </button>
        </nav>
      </div>
      <div className="flex items-center">
        <WalletConnect />
      </div>
    </header>
  );
}
