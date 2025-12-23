import AgroSafeABI from "../abi/AgroSafe.json";
import { usePublicClient, useWalletClient } from "wagmi";
import { Address } from "viem";

// Get contract address from global or fallback
const getContractAddress = (): string => {
    return (window as any).AGROSAFE_CONTRACT_ADDRESS || 
           import.meta.env?.VITE_AGROSAFE_ADDRESS || 
           "0x0000000000000000000000000000000000000000";
};

export function useAgroSafeRead() {
    const publicClient = usePublicClient();
    
    return {
        async getFarmerById(id: number) {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            return publicClient.readContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "farmers",
                args: [id]
            });
        },
        async getProduce(id: number) {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            return publicClient.readContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "produce",
                args: [id]
            });
        },
        async getTotalFarmers() {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            return publicClient.readContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "totalFarmers"
            });
        },
        async getTotalProduce() {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            return publicClient.readContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "totalProduce"
            });
        }
    };
}

export function useAgroSafeWrite() {
    const walletClient = useWalletClient();
    
    return {
        async registerFarmer(name: string, location: string) {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            return walletClient.data.writeContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "registerFarmer",
                args: [name, location]
            });
        },
        async recordProduce(cropType: string, harvestDate: string) {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            return walletClient.data.writeContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "recordProduce",
                args: [cropType, harvestDate]
            });
        },
        async verifyFarmer(farmerId: number, status: boolean) {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            return walletClient.data.writeContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "verifyFarmer",
                args: [farmerId, status]
            });
        },
        async certifyProduce(produceId: number, status: boolean) {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            return walletClient.data.writeContract({
                address: getContractAddress() as Address,
                abi: AgroSafeABI as any,
                functionName: "certifyProduce",
                args: [produceId, status]
            });
        }
    };
}
