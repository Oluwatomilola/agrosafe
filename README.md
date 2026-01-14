# AgroSafe

A decentralised solution for farmer registration and produce verification using blockchain.

## Project Structure

- **agrosafe-contracts/**: Smart contracts built with Foundry
- **agrosafe-frontend/**: React + TypeScript frontend with Wagmi and Reown AppKit

## Prerequisites

- Node.js 18+ and npm
- Foundry (for contract deployment)
- Git

## Setup & Deployment

### 1. Smart Contracts

```bash
cd agrosafe-contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Deploy to local Anvil (for testing)
anvil  # In one terminal
forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --broadcast  # In another
```

### 2. Frontend

```bash
cd agrosafe-frontend

# Install dependencies
npm install

# Create .env.local with your configuration
cp .env.local.example .env.local

# Edit .env.local with your contract address and Reown Project ID
# VITE_AGROSAFE_ADDRESS=<deployed-contract-address>
# VITE_REOWN_PROJECT_ID=<your-reown-project-id>

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

### Frontend (.env.local)

- `VITE_AGROSAFE_ADDRESS`: The deployed AgroSafe contract address
- `VITE_REOWN_PROJECT_ID`: Your Reown/WalletConnect project ID from https://cloud.reown.com/

VITE_AGROSAFE_ADDRESS = 0x5FbDB2315678afccb333f8a9c37f3C54f8b0e6db


## Key Fixes Applied

1. **Solidity Contract**: Fixed Ownable constructor call for OpenZeppelin v5 compatibility
2. **Frontend TypeScript**:
   - Consolidated viem imports to avoid duplication
   - Fixed walletClient hook usage (wagmi v2 pattern with `.data` property)
   - Added proper environment variable type definitions
   - Updated WagmiConfig to WagmiProvider (wagmi v2 API)
3. **Environment Setup**: Created .env.example files for configuration guidance

## Deployment Checklist

- [ ] Smart contract deployed and verified on target chain
- [ ] Contract address added to frontend `.env.local`
- [ ] Reown Project ID configured
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Test farmer registration and produce recording flows
