import React from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FarmerRegister from "./pages/FarmerRegister";
import Produce from "./pages/Produce";
import Admin from "./pages/Admin";
import Trace from "./pages/Trace";
import ErrorBoundary from "./components/ErrorBoundary";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";

export default function App() {
    const [route, setRoute] = React.useState("dashboard");

    const renderCurrentPage = () => {
        const pageProps = { key: route }; // Add key to force re-mount on route change
        
        switch (route) {
            case "dashboard":
                return (
                    <RouteErrorBoundary routeName="dashboard">
                        <Dashboard {...pageProps} />
                    </RouteErrorBoundary>
                );
            case "register":
                return (
                    <RouteErrorBoundary routeName="farmer registration">
                        <FarmerRegister {...pageProps} />
                    </RouteErrorBoundary>
                );
            case "produce":
                return (
                    <RouteErrorBoundary routeName="produce management">
                        <Produce {...pageProps} />
                    </RouteErrorBoundary>
                );
            case "admin":
                return (
                    <RouteErrorBoundary routeName="admin panel">
                        <Admin {...pageProps} />
                    </RouteErrorBoundary>
                );
            case "trace":
                return (
                    <RouteErrorBoundary routeName="traceability">
                        <Trace {...pageProps} />
                    </RouteErrorBoundary>
                );
            default:
                return (
                    <RouteErrorBoundary routeName="unknown">
                        <Dashboard {...pageProps} />
                    </RouteErrorBoundary>
                );
        }
    };

    return (
        <ErrorBoundary 
            level="page" 
            title="Application Error"
            description="The application encountered an unexpected error"
        >
            <div className="min-h-screen bg-slate-50">
                <ErrorBoundary 
                    level="component" 
                    title="Navigation Error"
                    description="Unable to load the navigation bar"
                >
                    <Navbar setRoute={setRoute} />
                </ErrorBoundary>
                <main className="p-6">
                    {renderCurrentPage()}
                </main>
            </div>
        </ErrorBoundary>
    );
}
