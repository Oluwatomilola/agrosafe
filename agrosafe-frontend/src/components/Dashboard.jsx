import { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Card, CardHeader, CardBody, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers';
import AgroSafe from '../contracts/Agrosafe.json';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

export default function Dashboard() {
    const { library, account } = useWeb3React();
    const [farmers, setFarmers] = useState([]);
    const [produce, setProduce] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!library) return;

            try {
                const contract = new Contract(CONTRACT_ADDRESS, AgroSafe.abi, library);

                // Fetch total farmers
                const totalFarmers = await contract.totalFarmers();
                const farmersList = [];
                for (let i = 1; i <= totalFarmers; i++) {
                    const farmer = await contract.farmers(i);
                    farmersList.push({
                        id: farmer.id.toString(),
                        name: farmer.name,
                        wallet: farmer.wallet,
                        location: farmer.location,
                        verified: farmer.verified
                    });
                }
                setFarmers(farmersList);

                // Fetch total produce
                const totalProduce = await contract.totalProduce();
                const produceList = [];
                for (let i = 1; i <= totalProduce; i++) {
                    const item = await contract.produce(i);
                    produceList.push({
                        id: item.id.toString(),
                        farmerId: item.farmerId.toString(),
                        cropType: item.cropType,
                        harvestDate: item.harvestDate,
                        certified: item.certified
                    });
                }
                setProduce(produceList);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [library]);

    if (loading) return <div>Loading...</div>;

    return (
        <Box>
            <Heading size="lg" mb={6}>Farmers</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={8}>
                {farmers.map((farmer) => (
                    <Card key={farmer.id}>
                        <CardHeader>
                            <Heading size="md">{farmer.name}</Heading>
                            <Text fontSize="sm" color="gray.500">{farmer.location}</Text>
                        </CardHeader>
                        <CardBody>
                            <Text>ID: {farmer.id}</Text>
                            <Text>Wallet: {`${farmer.wallet.substring(0, 6)}...${farmer.wallet.substring(38)}`}</Text>
                            <Text>Status: {farmer.verified ? 'Verified' : 'Not Verified'}</Text>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>

            <Heading size="lg" mb={6}>Produce</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {produce.map((item) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <Heading size="md">{item.cropType}</Heading>
                            <Text fontSize="sm" color="gray.500">Harvested: {item.harvestDate}</Text>
                        </CardHeader>
                        <CardBody>
                            <Text>ID: {item.id}</Text>
                            <Text>Farmer ID: {item.farmerId}</Text>
                            <Text>Status: {item.certified ? 'Certified' : 'Not Certified'}</Text>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
}