import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

const MOCK_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0Ab3e";
const SHORT_ADDRESS = "0x742d...Ab3e";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = useCallback(() => {
    setIsConnected(true);
    setAddress(MOCK_ADDRESS);
    toast({
      title: "Wallet Connected!",
      description: `Connected as ${SHORT_ADDRESS}`,
    });
  }, [toast]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, [toast]);

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
