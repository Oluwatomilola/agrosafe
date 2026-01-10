import AgroSafeABI from "../abi/AgroSafe.json";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseAbi, parseContractResult } from "viem";
import { Address } from "viem";

const CONTRACT_ADDRESS = import.meta.env.VITE_AGROSAFE_ADDRESS as string;

export function useAgroSafeRead() {
    const publicClient = usePublicClient();
    return {
        async getFarmerById(id: number) {
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "farmers",
                args: [id]
            });
        },
        async totalFarmers() {
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "totalFarmers"
            });
        },
        async getProduce(id: number) {
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "produce",
                args: [id]
            });
        },
        async getFarmerByWallet(wallet: string) {
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "getFarmerByWallet",
                args: [wallet as Address]
            });
        }
    };
}

export function useAgroSafeWrite() {
    const walletClient = useWalletClient();
    return {
        async registerFarmer(name: string, location: string) {
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "registerFarmer",
                args: [name, location]
            });
        },
        async recordProduce(cropType: string, harvestDate: string) {
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "recordProduce",
                args: [cropType, harvestDate]
            });
        },
        async verifyFarmer(farmerId: number, status: boolean) {
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "verifyFarmer",
                args: [farmerId, status]
            });
        },
        async certifyProduce(produceId: number, status: boolean) {
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "certifyProduce",
                args: [produceId, status]
            });
        }
    };
}
