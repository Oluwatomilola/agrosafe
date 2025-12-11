import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    address,
    isConnected,
    chain,
    connect,
    connectors,
    error,
    isLoading,
    pendingConnector,
    disconnect,
  };
}
