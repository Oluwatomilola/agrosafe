import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectButton() {
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected && address) {
        return (
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">
                    Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button 
                    onClick={() => disconnect()} 
                    className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => {
                const connector = connectors[0];
                if (connector) {
                    connect({ connector });
                }
            }}
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
        >
            Connect Wallet
        </button>
    );
}
