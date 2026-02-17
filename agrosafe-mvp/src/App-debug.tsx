import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/hooks/use-wallet";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Add debugging logs
console.log("App.tsx: Starting to import components");

let App;
try {
  console.log("App.tsx: Creating QueryClient");
  const queryClient = new QueryClient();
  
  console.log("App.tsx: All imports successful");
  
  App = () => {
    console.log("App.tsx: Rendering App component");
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WalletProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  };
} catch (error) {
  console.error("App.tsx: Error during import or initialization:", error);
  App = () => <div>Error loading application: {error.message}</div>;
}

export default App;