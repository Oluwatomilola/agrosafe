import React from "react";
import {
    configureChains,
    createConfig,
    WagmiConfig
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { foundry } from "viem/chains"; // example chain; replace if using Base Sepolia
import { createAppKit } from "@reown/appkit";
import { appKitWagmi } from "@reown/appkit/wagmi";

const chains = [foundry]; // replace with chain you use, e.g., baseSepolia (if viem has it)
const { publicClient } = configureChains(chains, [publicProvider()]);

// configure AppKit
const appKit = createAppKit({
    projectId: import.meta.env.VITE_REOWN_PROJECT_ID || "",
    chains
});

// wagmi config via appKit helper
const wagmiConfig = createConfig({
    publicClient,
    connectors: appKitWagmi({ appKit })
});

export const WagmiReownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
