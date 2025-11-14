import { useState } from 'react';
import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
import AgroSafe from '../contracts/Agrosafe.json';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

export default function FarmerRegistration() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const { library, account } = useWeb3React();
    const toast = useToast();

    const register = async (e) => {
        e.preventDefault();
        if (!name || !location) {
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
            const tx = await contract.registerFarmer(name, location);
            await tx.wait();
            toast({
                title: 'Success',
                description: 'Farmer registered successfully',
                status: 'success',
            });
            setName('');
            setLocation('');
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
        <VStack as="form" onSubmit={register} spacing={4} align="stretch">
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                />
            </FormControl>
            <Button
                type="submit"
                colorScheme="green"
                isLoading={loading}
                loadingText="Registering..."
            >
                Register as Farmer
            </Button>
        </VStack>
    );
}