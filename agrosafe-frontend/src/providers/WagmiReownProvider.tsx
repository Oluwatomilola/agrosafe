import React from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { http } from "wagmi";
import { foundry } from "viem/chains";
import { createAppKit } from "@reown/appkit";
import { appKitWagmi } from "@reown/appkit/wagmi";

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
});

export const WagmiReownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
};
