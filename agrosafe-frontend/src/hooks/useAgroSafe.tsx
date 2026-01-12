import AgroSafeABI from "../abi/AgroSafe.json";
import { usePublicClient, useWalletClient } from "wagmi";
import { parseAbi, Address, Abi } from "viem";

const CONTRACT_ADDRESS = (import.meta.env.VITE_AGROSAFE_ADDRESS as string) || "";
const PARSED_ABI = parseAbi(AgroSafeABI as unknown as Abi);

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
    if (!raw) throw new Error("Farmer data is null or undefined");
    const id = raw?.id ?? raw?.[0];
    const name = raw?.name ?? raw?.[1];
    const wallet = raw?.wallet ?? raw?.[2];
    const location = raw?.location ?? raw?.[3];
    const verified = raw?.verified ?? raw?.[4];
    if (id == null || name == null || wallet == null || location == null || verified == null) {
        throw new Error("Incomplete farmer data received from contract");
    }
    return {
        id: Number(id),
        name: String(name),
        wallet: String(wallet),
        location: String(location),
        verified: Boolean(verified)
    };
}

function normalizeProduce(raw: any): Produce {
    if (!raw) throw new Error("Produce data is null or undefined");
    // ABI order: id, farmerId, cropType, harvestDate, certified
    // Note: ABI has wrong order for produce struct, should be id, farmerId, cropType, harvestDate, certified
    // But current ABI has id, cropType, harvestDate, farmerId, certified
    // So adjust normalization accordingly
    const id = raw?.id ?? raw?.[0];
    const farmerId = raw?.farmerId ?? raw?.[1];
    const cropType = raw?.cropType ?? raw?.[2];
    const harvestDate = raw?.harvestDate ?? raw?.[3];
    const certified = raw?.certified ?? raw?.[4];
    if (id == null || farmerId == null || cropType == null || harvestDate == null || certified == null) {
        throw new Error("Incomplete produce data received from contract");
    }
    return {
        id: Number(id),
        cropType: String(cropType),
        harvestDate: String(harvestDate),
        farmerId: Number(farmerId),
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
                functionName: "farmers",
                args: [id]
            });
            return normalizeFarmer(raw as any);
        },
        async totalFarmers() {
            if (!publicClient) throw new Error("publicClient is not available");
            return await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "totalFarmers",
                args: []
            });
        },
        async totalProduce() {
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "totalProduce",
                args: []
            });
        },
        async totalProduce() {
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "totalProduce",
                args: []
            });
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
        },
        async getFarmerByWallet(wallet: string) {
            return publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: AgroSafeABI as any,
                functionName: "getFarmerByWallet",
                args: [wallet as Address]
            });
            return normalizeProduce(raw as any);
        },
        async getTotalFarmers() {
            if (!publicClient) throw new Error("publicClient is not available");
            return await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "totalFarmers",
                args: []
            }) as bigint;
        },
        async getTotalProduce() {
            if (!publicClient) throw new Error("publicClient is not available");
            return await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "totalProduce",
                args: []
            }) as bigint;
        },
        async getFarmerIdByWallet(wallet: string) {
            if (!publicClient) throw new Error("publicClient is not available");
            return await publicClient.readContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "farmerIdsByWallet",
                args: [wallet as Address]
            }) as bigint;
        }
    };
}

export function useAgroSafeWrite() {
    const { data: walletClient } = useWalletClient();
    if (!CONTRACT_ADDRESS) {
        throw new Error("VITE_AGROSAFE_ADDRESS is not set. Please configure your Vite env.");
    }
    return {
        async registerFarmer(name: string, location: string) {
            if (!walletClient) throw new Error("walletClient is not available");
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
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "registerFarmer",
                args: [name, location]
            });
        },
        async recordProduce(cropType: string, harvestDate: string) {
            if (!walletClient) throw new Error("walletClient is not available");
            if (!cropType.trim()) {
                throw new Error("Crop type is required");
            }
            if (!harvestDate.trim()) {
                throw new Error("Harvest date is required");
            }
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "recordProduce",
                args: [cropType, harvestDate]
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
        async certifyProduce(produceId: number, certified: boolean) {
            if (!walletClient) throw new Error("walletClient is not available");
            return walletClient.writeContract({
                address: CONTRACT_ADDRESS as Address,
                abi: PARSED_ABI,
                functionName: "certifyProduce",
                args: [BigInt(produceId), certified]
            });
        }
    };
}
