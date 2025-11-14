import { Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../App';

export default function Navbar() {
    const { active, account, activate, deactivate } = useWeb3React();

    const connect = async () => {
        try {
            await activate(injected);
        } catch (ex) {
            console.log(ex);
        }
    };

    const disconnect = () => {
        deactivate();
    };

    return (
        <Flex bg="green.600" p={4} color="white">
            <Text fontSize="xl" fontWeight="bold">AgroSafe</Text>
            <Spacer />
            {active ? (
                <Button colorScheme="whiteAlpha" onClick={disconnect}>
                    {`${account.substring(0, 6)}...${account.substring(38)}`}
                </Button>
            ) : (
                <Button colorScheme="whiteAlpha" onClick={connect}>
                    Connect Wallet
                </Button>
            )}
        </Flex>
    );
}