import AgroSafeABI from "../abi/AgroSafe.json";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseAbi } from "viem";
import { Address } from "viem";

const CONTRACT_ADDRESS = (import.meta.env.VITE_AGROSAFE_ADDRESS as string) || "";
const PARSED_ABI = parseAbi(AgroSafeABI as any);

export type Farmer = {
    id: number;
    name: string;
    wallet: string;
    location: string;
    verified: boolean;
};

export type Produce = {
    id: number;
    cropType: string;
    harvestDate: string;
    farmerId: number;
    certified: boolean;
};

function normalizeFarmer(raw: any): Farmer {
    const id = raw?.id ?? raw?.[0];
    const name = raw?.name ?? raw?.[1] ?? "";
    const wallet = raw?.wallet ?? raw?.[2] ?? "";
    const location = raw?.location ?? raw?.[3] ?? "";
    const verified = raw?.verified ?? raw?.[4] ?? false;
    return {
        id: Number(id ?? 0),
        name: String(name),
        wallet: String(wallet),
        location: String(location),
        verified: Boolean(verified)
    };
}

function normalizeProduce(raw: any): Produce {
    const id = raw?.id ?? raw?.[0];
    const cropType = raw?.cropType ?? raw?.[1] ?? "";
    const harvestDate = raw?.harvestDate ?? raw?.[2] ?? "";
    const farmerId = raw?.farmerId ?? raw?.[3];
    const certified = raw?.certified ?? raw?.[4] ?? false;
    return {
        id: Number(id ?? 0),
        cropType: String(cropType),
        harvestDate: String(harvestDate),
        farmerId: Number(farmerId ?? 0),
        certified: Boolean(certified)
    };
}

export function useAgroSafeRead() {
    const publicClient = usePublicClient();
    if (!CONTRACT_ADDRESS) {
        throw new Error("VITE_AGROSAFE_ADDRESS is not set. Please configure your Vite env.");
    }
    return {
        async getFarmerById(id: number) {
            if (!publicClient) throw new Error("publicClient is not available");
            const raw = await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
// Type definitions for contract data
export interface Farmer {
    id: bigint;
    name: string;
    wallet: Address;
    location: string;
    verified: boolean;
}

export interface Produce {
    id: bigint;
    farmerId: bigint;
    cropType: string;
    harvestDate: string;
    certified: boolean;
}

// Type the ABI properly
const typedAgroSafeABI = AgroSafeABI;

// Get contract address from global or fallback
const getContractAddress = (): Address => {
    const address = (window as any).AGROSAFE_CONTRACT_ADDRESS || 
                   (import.meta as any).env?.VITE_AGROSAFE_ADDRESS || 
                   "0x7b069901F522FFA21f705ed94b520e231D29f4eB";
    return address as Address;
};

export function useAgroSafeRead() {
    const publicClient = usePublicClient();
    
    return {
        async getFarmerById(id: number): Promise<Farmer> {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            const result = await publicClient.readContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "farmers",
                args: [id]
            });
            return normalizeFarmer(raw as any);
        },
        // Note: contract ABI does not expose a `totalFarmers` function.
        async totalFarmers() {
            if (!publicClient) throw new Error("publicClient is not available");
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "totalFarmers"
            }) as bigint;
        },
        async getProduce(id: number) {
            if (!publicClient) throw new Error("publicClient is not available");
            const raw = await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "produce",
                args: [id]
            });
            return normalizeProduce(raw as any);
        }
    };
}

export function useAgroSafeWrite() {
    const walletClient = useWalletClient();
    if (!CONTRACT_ADDRESS) {
        throw new Error("VITE_AGROSAFE_ADDRESS is not set. Please configure your Vite env.");
    }
    return {
        async registerFarmer(name: string, location: string) {
            if (!walletClient) throw new Error("walletClient is not available");
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
    
    return {
        async registerFarmer(name: string, location: string): Promise<`0x${string}`> {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            // Input validation
            if (!name.trim()) {
                throw new Error("Name is required");
            }
            
            if (!location.trim()) {
                throw new Error("Location is required");
            }
            
            if (name.length > 100) {
                throw new Error("Name must be less than 100 characters");
            }
            
            if (location.length > 200) {
                throw new Error("Location must be less than 200 characters");
            }
            
            return await walletClient.data.writeContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "registerFarmer",
                args: [name.trim(), location.trim()]
            });
        },
        async recordProduce(cropType: string, harvestDate: string) {
            if (!walletClient) throw new Error("walletClient is not available");
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "recordProduce",
                args: [cropType.trim(), harvestDate.trim()]
            });
        },
        async verifyFarmer(farmerId: number, status: boolean) {
            if (!walletClient) throw new Error("walletClient is not available");
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "verifyFarmer",
                args: [BigInt(farmerId), status]
            });
        },
        async certifyProduce(produceId: number, status: boolean) {
            if (!walletClient) throw new Error("walletClient is not available");
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "certifyProduce",
                args: [BigInt(produceId), status]
            });
        }
    };
}
