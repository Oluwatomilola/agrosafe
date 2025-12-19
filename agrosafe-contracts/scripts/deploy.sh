#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Deploy the contract
echo "Deploying AgroSafe contract to Base network..."
forge script script/Deploy.s.sol:DeployAgroSafe \
    --rpc-url $BASE_RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvvv \
    --chain-id 8453

echo "Deployment completed successfully!"
