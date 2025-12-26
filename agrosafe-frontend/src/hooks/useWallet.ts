import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

/**
 * Custom React hook for managing wallet connection and Web3 account state
 * 
 * This hook provides a centralized interface for wallet-related operations
 * and account information. It wraps Wagmi's wallet management functionality
 * to provide a clean API for React components.
 * 
 * Features:
 * - Account connection status tracking
 * - Network information (current chain, network details)
 * - Connection management (connect, disconnect)
 * - Available wallet connector information
 * - Loading and error states for connection operations
 * 
 * @returns Object containing wallet state and management functions
 * 
 * @example
 * ```typescript
 * const { 
 *   address, 
 *   isConnected, 
 *   chain, 
 *   connect, 
 *   disconnect, 
 *   error, 
 *   isLoading 
 * } = useWallet();
 * 
 * // Check if wallet is connected
 * if (isConnected) {
 *   console.log(`Connected to: ${address}`);
 * }
 * 
 * // Connect wallet
 * await connect({ connector: injected() });
 * 
 * // Disconnect wallet
 * disconnect();
 * ```
 */
export function useWallet() {
    /** Current account address and connection status */
    const { address, isConnected } = useAccount();
    
    /** Current network information (chain ID, name, etc.) */
    const { chain } = useNetwork();
    
    /** Wallet connection functionality and state */
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    
    /** Wallet disconnection functionality */
    const { disconnect } = useDisconnect();

    /**
     * Current connected wallet address
     * @returns string | undefined - Ethereum address or undefined if not connected
     */
    const walletAddress = address;
    
    /**
     * Connection status of the wallet
     * @returns boolean - True if wallet is connected, false otherwise
     */
    const walletConnected = isConnected;
    
    /**
     * Current blockchain network information
     * @returns Chain | undefined - Chain object with network details or undefined
     */
    const currentChain = chain;

    /**
     * Available wallet connectors for user to choose from
     * @returns Connector[] - Array of available wallet connection options
     */
    const availableConnectors = connectors;
    
    /**
     * Connection error if any occurred during wallet connection
     * @returns Error | undefined - Error object or undefined if no error
     */
    const connectionError = error;
    
    /**
     * Loading state during wallet connection process
     * @returns boolean - True if connection is in progress, false otherwise
     */
    const connectionLoading = isLoading;
    
    /**
     * The connector that is currently pending (if any)
     * @returns Connector | undefined - Connector object or undefined if none pending
     */
    const pendingWalletConnector = pendingConnector;

    /**
     * Complete wallet state object for convenient access
     */
    const walletState = {
        address: walletAddress,
        isConnected: walletConnected,
        chain: currentChain,
        connectors: availableConnectors,
        error: connectionError,
        isLoading: connectionLoading,
        pendingConnector: pendingWalletConnector,
    };

    /**
     * Wallet management functions for external use
     */
    const walletActions = {
        connect,
        disconnect,
    };

    /**
     * Return combined wallet state and actions
     * Provides both read-only state and callable functions
     */
    return {
        // State properties
        address: walletAddress,
        isConnected: walletConnected,
        chain: currentChain,
        connectors: availableConnectors,
        error: connectionError,
        isLoading: connectionLoading,
        pendingConnector: pendingWalletConnector,
        
        // Action functions
        connect,
        disconnect,
        
        // Combined objects for convenience
        state: walletState,
        actions: walletActions,
    };
}
