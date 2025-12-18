import React from "react";
import {
    configureChains,
    createConfig,
    WagmiConfig
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { base } from "viem/chains";
import { createAppKit } from "@reown/appkit";
import { appKitWagmi } from "@reown/appkit/wagmi";

// Configure chains
const { publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
);

// Initialize AppKit
const appKit = createAppKit({
    projectId: import.meta.env.VITE_REOWN_PROJECT_ID || "",
    chains: [celo],
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
