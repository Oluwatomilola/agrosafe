import React from 'react';
import { WalletConnect } from './WalletConnect';

/**
 * Props for the Navbar component
 */
interface NavbarProps {
    /** Function to handle route changes between different pages */
    setRoute: (route: string) => void;
}

/**
 * Navigation bar component for the AgroSafe application
 * 
 * This component provides the main navigation interface for the application,
 * including routing functionality to switch between different pages and 
 * wallet connection capabilities.
 * 
 * Features:
 * - Responsive navigation menu with accessibility support
 * - Route switching between Dashboard, Register, Produce, Admin, and Trace pages
 * - Integration with WalletConnect component for Web3 functionality
 * - Semantic HTML with proper ARIA labels for screen readers
 * 
 * @param props - Component props containing setRoute function
 * @returns JSX element representing the navigation bar
 */
export default function Navbar({ setRoute }: NavbarProps) {
    /**
     * Handles route changes when navigation buttons are clicked
     * @param route - The route name to navigate to
     */
    const handleRouteChange = (route: string) => {
        setRoute(route);
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow" role="banner">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold" aria-label="AgroSafe Application">
                    AgroSafe
                </h1>
                <nav className="space-x-3" role="navigation" aria-label="Main navigation">
                    <button 
                        onClick={() => handleRouteChange("dashboard")} 
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        aria-label="Go to Dashboard"
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => handleRouteChange("register")} 
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        aria-label="Go to Farmer Registration"
                    >
                        Register
                    </button>
                    <button 
                        onClick={() => handleRouteChange("produce")} 
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        aria-label="Go to Produce Management"
                    >
                        Produce
                    </button>
                    <button 
                        onClick={() => handleRouteChange("admin")} 
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        aria-label="Go to Admin Panel"
                    >
                        Admin
                    </button>
                    <button 
                        onClick={() => handleRouteChange("trace")} 
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        aria-label="Go to Traceability"
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
