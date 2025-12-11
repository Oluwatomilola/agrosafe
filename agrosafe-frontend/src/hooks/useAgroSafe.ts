import { useContract, useProvider, useSigner } from 'wagmi';
import AgroSafeABI from '../abi/AgroSafe.json';
import { Address } from 'viem';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as Address;

export function useAgroSafe() {
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: AgroSafeABI,
    signerOrProvider: signer || provider,
  });

  const registerFarmer = async (name: string, location: string) => {
    if (!contract) throw new Error('Contract not initialized');
    const tx = await contract.registerFarmer(name, location);
    await tx.wait();
    return tx;
  };

  const recordProduce = async (cropType: string, harvestDate: string) => {
    if (!contract) throw new Error('Contract not initialized');
    const tx = await contract.recordProduce(cropType, harvestDate);
    await tx.wait();
    return tx;
  };

  const getFarmer = async (farmerId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.farmers(farmerId);
  };

  const getProduce = async (produceId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.produce(produceId);
  };

  const getTotalFarmers = async () => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.totalFarmers();
  };

  const getTotalProduce = async () => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.totalProduce();
  };

  return {
    contract,
    registerFarmer,
    recordProduce,
    getFarmer,
    getProduce,
    getTotalFarmers,
    getTotalProduce,
  };
}
