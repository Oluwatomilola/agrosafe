import { ChakraProvider, Box, Container, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { Web3ReactManager } from './components/Web3ReactManager';
import Navbar from './components/Navbar';
import FarmerRegistration from './components/FarmerRegistration';
import RecordProduce from './components/RecordProduce';
import FarmerVerification from './components/FarmerVerification';
import CertifyProduce from './components/CertifyProduce';
import Dashboard from './components/Dashboard';

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 1337], // Add your network ID
});

function getLibrary(provider) {
    return new Web3Provider(provider);
}

function App() {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ChakraProvider>
                <Web3ReactManager>
                    <Box minH="100vh" bg="gray.50">
                        <Navbar />
                        <Container maxW="container.lg" py={8}>
                            <Tabs isFitted variant="enclosed">
                                <TabList mb="1em">
                                    <Tab>Dashboard</Tab>
                                    <Tab>Register as Farmer</Tab>
                                    <Tab>Record Produce</Tab>
                                    <Tab>Verify Farmers (Admin)</Tab>
                                    <Tab>Certify Produce (Admin)</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Dashboard />
                                    </TabPanel>
                                    <TabPanel>
                                        <FarmerRegistration />
                                    </TabPanel>
                                    <TabPanel>
                                        <RecordProduce />
                                    </TabPanel>
                                    <TabPanel>
                                        <FarmerVerification />
                                    </TabPanel>
                                    <TabPanel>
                                        <CertifyProduce />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Container>
                    </Box>
                </Web3ReactManager>
            </ChakraProvider>
        </Web3ReactProvider>
    );
}

export default App;