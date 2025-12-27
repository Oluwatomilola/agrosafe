import React from 'react';
import { useWallet } from '../hooks/useWallet';

export function WalletConnect() {
  const { address, isConnected, connect, connectors, disconnect, isLoading, pendingConnector } = useWallet();

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">
          {`${address?.substring(0, 6)}...${address?.substring(38)}`}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready || (isLoading && connector.id === pendingConnector?.id)}
          key={connector.id}
          onClick={() => connect({ connector })}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && connector.id === pendingConnector?.id
            ? 'Connecting...'
            : `Connect with ${connector.name}`}
          {!connector.ready && ' (unsupported)'}
        </button>
      ))}
    </div>
  );
}
