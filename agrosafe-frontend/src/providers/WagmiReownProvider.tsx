import React from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { http } from "wagmi";
import { foundry } from "viem/chains";
import { WagmiProvider, http } from "wagmi";
import { foundry, sepolia } from "viem/chains";
import { createAppKit } from "@reown/appkit";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

const chains = [foundry];

// configure AppKit
const appKit = createAppKit({
    projectId: import.meta.env.VITE_REOWN_PROJECT_ID || "",
    chains
});

// wagmi config via appKit helper
const wagmiConfig = createConfig({
    chains,
    transports: {
        [foundry.id]: http(),
    },
    connectors: appKitWagmi({ appKit })
const chains = [sepolia, foundry];

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "";

// Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
    chains,
    projectId,
    transports: {
        [foundry.id]: http(),
        [sepolia.id]: http(),
    }
});

const wagmiConfig = wagmiAdapter.wagmiConfig;

// Create AppKit
const appKit = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: chains,
    metadata: {
        name: "AgroSafe",
        description: "Decentralized farmer and produce verification",
        url: "http://localhost:5173",
        icons: ["https://avatars.githubusercontent.com/u/37784886"]
    }
});

export const WagmiReownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};
