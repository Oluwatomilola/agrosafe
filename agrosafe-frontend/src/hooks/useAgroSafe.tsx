import AgroSafeABI from "../abi/AgroSafe.json";
import { usePublicClient, useWalletClient } from "wagmi";
import { Address } from "viem";

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
                args: [BigInt(id)]
            }) as [bigint, string, Address, string, boolean];
            
            return {
                id: result[0],
                name: result[1],
                wallet: result[2],
                location: result[3],
                verified: result[4]
            };
        },
        
        async getProduce(id: number): Promise<Produce> {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            const result = await publicClient.readContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "produce",
                args: [BigInt(id)]
            }) as [bigint, string, string, bigint, boolean];
            
            return {
                id: result[0],
                farmerId: result[3],
                cropType: result[1],
                harvestDate: result[2],
                certified: result[4]
            };
        },
        
        async getTotalFarmers(): Promise<bigint> {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            return await publicClient.readContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "totalFarmers"
            }) as bigint;
        },
        
        async getTotalProduce(): Promise<bigint> {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            return await publicClient.readContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "totalProduce"
            }) as bigint;
        },
        
        async getFarmerIdByWallet(wallet: Address): Promise<bigint> {
            if (!publicClient) {
                throw new Error("Public client not available");
            }
            
            return await publicClient.readContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "farmerIdsByWallet",
                args: [wallet]
            }) as bigint;
        }
    };
}

export function useAgroSafeWrite() {
    const walletClient = useWalletClient();
    
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
        
        async recordProduce(cropType: string, harvestDate: string): Promise<`0x${string}`> {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            // Input validation
            if (!cropType.trim()) {
                throw new Error("Crop type is required");
            }
            
            if (!harvestDate.trim()) {
                throw new Error("Harvest date is required");
            }
            
            if (cropType.length > 100) {
                throw new Error("Crop type must be less than 100 characters");
            }
            
            // Validate date format (basic validation)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(harvestDate)) {
                throw new Error("Harvest date must be in YYYY-MM-DD format");
            }
            
            const harvestDateObj = new Date(harvestDate);
            const currentDate = new Date();
            if (harvestDateObj > currentDate) {
                throw new Error("Harvest date cannot be in the future");
            }
            
            return await walletClient.data.writeContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "recordProduce",
                args: [cropType.trim(), harvestDate.trim()]
            });
        },
        
        async verifyFarmer(farmerId: number, status: boolean): Promise<`0x${string}`> {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            if (farmerId <= 0) {
                throw new Error("Invalid farmer ID");
            }
            
            return await walletClient.data.writeContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "verifyFarmer",
                args: [BigInt(farmerId), status]
            });
        },
        
        async certifyProduce(produceId: number, status: boolean): Promise<`0x${string}`> {
            if (!walletClient?.data) {
                throw new Error("Wallet not connected");
            }
            
            if (produceId <= 0) {
                throw new Error("Invalid produce ID");
            }
            
            return await walletClient.data.writeContract({
                address: getContractAddress(),
                abi: typedAgroSafeABI,
                functionName: "certifyProduce",
                args: [BigInt(produceId), status]
            });
        }
    };
}
