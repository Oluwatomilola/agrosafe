import React from "react";
import {
    configureChains,
    createConfig,
    WagmiConfig
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { base } from "viem/chains";
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
// Configure chains
const { publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
);

// Initialize AppKit
const appKit = createAppKit({
    projectId: (import.meta.env.VITE_REOWN_PROJECT_ID as string) || "",
    chains: [base]
});

// Create wagmi config with AppKit connectors
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: appKitWagmi({ appKit }),
});

interface WagmiReownProviderProps {
  children: React.ReactNode;
}

export const WagmiReownProvider: React.FC<WagmiReownProviderProps> = ({ 
  children 
}) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};
