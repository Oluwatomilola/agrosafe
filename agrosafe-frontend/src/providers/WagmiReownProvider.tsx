import React from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit";
import { appKitWagmi } from "@reown/appkit/wagmi";

// Initialize query client for react-query
const queryClient = new QueryClient();

// Define supported chains
const chains = [mainnet, sepolia];

// Get project ID from environment
const projectId = process.env.REACT_APP_REOWN_PROJECT_ID || 
                 (import.meta as any).env?.VITE_REOWN_PROJECT_ID ||
                 "";

if (!projectId) {
    console.warn("Warning: VITE_REOWN_PROJECT_ID is not set");
}

// Configure AppKit
const appKit = createAppKit({
    projectId,
    chains,
    metadata: {
        name: "AgroSafe",
        description: "A blockchain-based produce traceability platform",
        url: window.location.origin,
        icons: []
    }
});

// Configure wagmi
const wagmiConfig = createConfig({
    chains,
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http()
    },
    connectors: appKitWagmi({ appKit })
});

export const WagmiReownProvider: React.FC<{ children: React.ReactNode }> = ({ 
    children 
}) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
};
