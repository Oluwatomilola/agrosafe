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
    projectId: process.env.REACT_APP_REOWN_PROJECT_ID || "",
    chains
});
