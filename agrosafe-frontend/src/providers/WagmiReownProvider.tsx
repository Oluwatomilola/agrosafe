import React from "react";
import {
    configureChains,
    createConfig,
    WagmiConfig
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { foundry } from "viem/chains"; // example chain; replace if using Base Sepolia
import { createAppKit } from "@reown/appkit";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Environment variable validation with fallback
const REOWN_PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID || "demo_project_id";
const CONTRACT_ADDRESS = import.meta.env.VITE_AGROSAFE_ADDRESS || "0x0000000000000000000000000000000000000000";

if (!REOWN_PROJECT_ID || REOWN_PROJECT_ID === "demo_project_id") {
    console.warn("Using demo Reown project ID. Please set VITE_REOWN_PROJECT_ID in your .env file for production use.");
}

// Set the contract address globally for use in hooks
(window as any).AGROSAFE_CONTRACT_ADDRESS = CONTRACT_ADDRESS;

const chains = [foundry]; // replace with chain you use, e.g., baseSepolia
const { publicClient } = configureChains(chains, [publicProvider()]);

// configure AppKit with validated project ID
const appKit = createAppKit({
    projectId: REOWN_PROJECT_ID,
    chains
});

// wagmi config via appKit helper  
const wagmiConfig = createConfig({
    publicClient,
    connectors: []
});

export const WagmiReownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
