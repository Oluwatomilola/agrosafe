import { useContract, useProvider, useSigner } from 'wagmi';
import AgroSafeABI from '../abi/AgroSafe.json';
import { Address } from 'viem';

/**
 * Environment variable containing the deployed contract address
 * @remarks This should be set in the .env file as VITE_CONTRACT_ADDRESS
 */
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as Address;

/**
 * Custom React hook for interacting with the AgroSafe smart contract
 * 
 * This hook provides a convenient interface for React components to interact
 * with the AgroSafe blockchain contract. It handles contract initialization,
 * transaction sending, and data retrieval from the blockchain.
 * 
 * Features:
 * - Automatic contract initialization with ABI and address
 * - Provider/signer support for read-only and transaction methods
 * - Type-safe interactions with TypeScript
 * - Error handling for uninitialized contract states
 * 
 * @returns Object containing contract instance and interaction methods
 * 
 * @example
 * ```typescript
 * const { registerFarmer, recordProduce, getFarmer } = useAgroSafe();
 * 
 * // Register a new farmer
 * await registerFarmer("John Doe", "Farm Location");
 * 
 * // Record produce for verified farmer
 * await recordProduce("Wheat", "2023-12-01");
 * 
 * // Get farmer information
 * const farmer = await getFarmer(1);
 * ```
 */
export function useAgroSafe() {
    /** Web3 provider for read-only contract interactions */
    const provider = useProvider();
    
    /** Signer for transaction-enabled contract interactions */
    const { data: signer } = useSigner();

    /**
     * Contract instance configured with ABI, address, and provider/signer
     * Automatically uses signer when available, falls back to provider
     */
    const contract = useContract({
        address: CONTRACT_ADDRESS,
        abi: AgroSafeABI,
        signerOrProvider: signer || provider,
    });

    /**
     * Registers a new farmer on the blockchain
     * 
     * @param name - Farmer's full name (2-100 characters)
     * @param location - Farmer's location (3-200 characters)
     * @returns Promise resolving to the transaction receipt
     * @throws Error if contract is not initialized
     * 
     * @remarks This is a write operation that requires gas fees
     */
    const registerFarmer = async (name: string, location: string) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.registerFarmer(name, location);
        await tx.wait();
        return tx;
    };

    /**
     * Records new produce for a verified farmer
     * 
     * @param cropType - Type of crop (2-50 characters)
     * @param harvestDate - Harvest date in YYYY-MM-DD format
     * @returns Promise resolving to the transaction receipt
     * @throws Error if contract is not initialized or farmer not verified
     * 
     * @remarks This is a write operation that requires gas fees and verified farmer status
     */
    const recordProduce = async (cropType: string, harvestDate: string) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.recordProduce(cropType, harvestDate);
        await tx.wait();
        return tx;
    };

    /**
     * Retrieves farmer information by ID
     * 
     * @param farmerId - Unique identifier of the farmer
     * @returns Promise resolving to Farmer struct data
     * @throws Error if contract is not initialized
     * 
     * @remarks This is a read operation that doesn't require gas fees
     */
    const getFarmer = async (farmerId: number) => {
        if (!contract) throw new Error('Contract not initialized');
        return await contract.farmers(farmerId);
    };

    /**
     * Retrieves produce information by ID
     * 
     * @param produceId - Unique identifier of the produce item
     * @returns Promise resolving to Produce struct data
     * @throws Error if contract is not initialized
     * 
     * @remarks This is a read operation that doesn't require gas fees
     */
    const getProduce = async (produceId: number) => {
        if (!contract) throw new Error('Contract not initialized');
        return await contract.produce(produceId);
    };

    /**
     * Gets the total number of registered farmers
     * 
     * @returns Promise resolving to the total farmer count
     * @throws Error if contract is not initialized
     * 
     * @remarks This is a read operation that doesn't require gas fees
     */
    const getTotalFarmers = async () => {
        if (!contract) throw new Error('Contract not initialized');
        return await contract.totalFarmers();
    };

    /**
     * Gets the total number of recorded produce items
     * 
     * @returns Promise resolving to the total produce count
     * @throws Error if contract is not initialized
     * 
     * @remarks This is a read operation that doesn't require gas fees
     */
    const getTotalProduce = async () => {
        if (!contract) throw new Error('Contract not initialized');
        return await contract.totalProduce();
    };

    /**
     * Gets paginated list of farmers
     * 
     * @param offset - Starting index (0-based)
     * @param limit - Number of items to retrieve (max 100)
     * @returns Promise resolving to array of Farmer structs
     * @throws Error if contract is not initialized or invalid parameters
     * 
     * @remarks This is a read operation that doesn't require gas fees
     */
    const getFarmersPaginated = async (offset: number, limit: number) => {
        if (!contract) throw new Error('Contract not initialized');
        return await contract.getFarmersPaginated(offset, limit);
    };

    /**
     * Gets paginated list of produce items
     * 
     * @param offset - Starting index (0-based)
     * @param limit - Number of items to retrieve (max 100)
     * @returns Promise resolving to array of Produce structs
     * @throws Error if contract is not initialized or invalid parameters
     * 
     * @remarks This is a read operation that doesn't require gas fees
     */
    const getProducePaginated = async (offset: number, limit: number) => {
        if (!contract) throw new Error('Contract not initialized');
        return await contract.getProducePaginated(offset, limit);
    };

    /**
     * Gets paginated list of produce items for a specific farmer
     * 
     * @param farmerId - ID of the farmer
     * @param offset - Starting index (0-based)
     * @param limit - Number of items to retrieve (max 100)
     * @returns Promise resolving to array of Produce structs
     * @throws Error if contract is not initialized or invalid parameters
     * 
     * @remarks This is a read operation that doesn't require gas fees
     */
    const getProduceByFarmerPaginated = async (farmerId: number, offset: number, limit: number) => {
        if (!contract) throw new Error('Contract not initialized');
        return await contract.getProduceByFarmerPaginated(farmerId, offset, limit);
    };

    /**
     * Verifies a farmer (admin only)
     * 
     * @param farmerId - ID of the farmer to verify
     * @param status - Verification status to set
     * @returns Promise resolving to the transaction receipt
     * @throws Error if contract is not initialized or not admin
     * 
     * @remarks This is a write operation that requires gas fees and admin privileges
     */
    const verifyFarmer = async (farmerId: number, status: boolean) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.verifyFarmer(farmerId, status);
        await tx.wait();
        return tx;
    };

    /**
     * Certifies produce (admin only)
     * 
     * @param produceId - ID of the produce to certify
     * @param certified - Certification status to set
     * @returns Promise resolving to the transaction receipt
     * @throws Error if contract is not initialized or not admin
     * 
     * @remarks This is a write operation that requires gas fees and admin privileges
     */
    const certifyProduce = async (produceId: number, certified: boolean) => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.certifyProduce(produceId, certified);
        await tx.wait();
        return tx;
    };

    /**
     * Pauses contract operations (admin only)
     * 
     * @returns Promise resolving to the transaction receipt
     * @throws Error if contract is not initialized or not admin
     * 
     * @remarks This is a write operation that requires gas fees and admin privileges
     */
    const pause = async () => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.pause();
        await tx.wait();
        return tx;
    };

    /**
     * Unpauses contract operations (admin only)
     * 
     * @returns Promise resolving to the transaction receipt
     * @throws Error if contract is not initialized or not admin
     * 
     * @remarks This is a write operation that requires gas fees and admin privileges
     */
    const unpause = async () => {
        if (!contract) throw new Error('Contract not initialized');
        const tx = await contract.unpause();
        await tx.wait();
        return tx;
    };

    /**
     * Return object with all contract interaction methods
     * Includes both read-only and transaction methods
     */
    return {
        contract,
        // Farmer operations
        registerFarmer,
        verifyFarmer,
        getFarmer,
        getTotalFarmers,
        getFarmersPaginated,
        // Produce operations
        recordProduce,
        certifyProduce,
        getProduce,
        getTotalProduce,
        getProducePaginated,
        getProduceByFarmerPaginated,
        // Administrative operations
        pause,
        unpause,
    };
}
