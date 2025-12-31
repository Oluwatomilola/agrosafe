import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectButton() {
    const { address, isConnected } = useAccount();
    const connect = useConnect();
    const disconnect = useDisconnect();

    if (isConnected) {
        return (
            <div className="flex items-center space-x-3">
                <span className="text-sm">Connected: {address?.slice(0,6)}...{address?.slice(-4)}</span>
                <button onClick={() => disconnect.disconnect()} className="btn">
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => connect.connect()}
            className="btn"
        >
            Connect Wallet
        </button>
    );
}
