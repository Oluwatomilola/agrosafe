import { useState } from 'react';
import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
import AgroSafe from '../contracts/Agrosafe.json';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

export default function RecordProduce() {
    const [cropType, setCropType] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [loading, setLoading] = useState(false);
    const { library, account } = useWeb3React();
    const toast = useToast();

    const record = async (e) => {
        e.preventDefault();
        if (!cropType || !harvestDate) {
            toast({
                title: 'Error',
                description: 'Please fill all fields',
                status: 'error',
            });
            return;
        }

        try {
            setLoading(true);
            const signer = library.getSigner();
            const contract = new Contract(CONTRACT_ADDRESS, AgroSafe.abi, signer);
            const tx = await contract.recordProduce(cropType, harvestDate);
            await tx.wait();
            toast({
                title: 'Success',
                description: 'Produce recorded successfully',
                status: 'success',
            });
            setCropType('');
            setHarvestDate('');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack as="form" onSubmit={record} spacing={4} align="stretch">
            <FormControl isRequired>
                <FormLabel>Crop Type</FormLabel>
                <Input
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="e.g., Wheat, Rice, etc."
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Harvest Date</FormLabel>
                <Input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                />
            </FormControl>
            <Button
                type="submit"
                colorScheme="green"
                isLoading={loading}
                loadingText="Recording..."
            >
                Record Produce
            </Button>
        </VStack>
    );
}