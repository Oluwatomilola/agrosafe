# 🚀 AgroSafe Deployment Guide

This comprehensive guide covers deployment procedures for AgroSafe across different environments, from local development to mainnet production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Testnet Deployment](#testnet-deployment)
4. [Mainnet Deployment](#mainnet-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Security Considerations](#security-considerations)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

```bash
# Node.js and npm
node --version  # v18.0.0 or higher
npm --version   # 9.0.0 or higher

# Foundry for smart contract development
forge --version # Latest version

# Git
git --version   # Latest version

# MetaMask or compatible Web3 wallet
```

### Required Accounts and APIs

1. **RPC Provider Account**
   - [Alchemy](https://www.alchemy.com/) (recommended)
   - [Infura](https://www.infura.io/)
   - [QuickNode](https://www.quicknode.com/)

2. **Blockchain Explorer API**
   - [Etherscan](https://etherscan.io/apis) (for verification)
   - [Polygonscan](https://docs.polygonscan.com/) (for Polygon)

3. **Deployment Wallet**
   - Dedicated wallet for deployments
   - Sufficient funds for gas fees
   - Secure private key management

## Local Development Setup

### Smart Contract Development

```bash
# Clone and setup repository
git clone https://github.com/your-org/agrosafe.git
cd agrosafe/agrosafe-contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Generate test coverage
forge coverage

# Start local Anvil node (for testing)
anvil
```

### Frontend Development

```bash
# Navigate to frontend directory
cd ../agrosafe-frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Local Testing Workflow

1. **Start Local Blockchain**
   ```bash
   cd agrosafe-contracts
   anvil --port 8545
   ```

2. **Deploy to Local Network**
   ```bash
   # In another terminal
   cd agrosafe-contracts
   forge script script/Deploy.s.sol:DeployScript --fork-url http://localhost:8545 --broadcast
   ```

3. **Update Frontend Configuration**
   ```bash
   # Update .env.local with local contract address
   echo "VITE_CONTRACT_ADDRESS=0x..." > agrosafe-frontend/.env.local
   ```

4. **Test Frontend**
   ```bash
   cd agrosafe-frontend
   npm run dev
   ```

## Testnet Deployment

### Sepolia Testnet Deployment

#### 1. Environment Setup

```bash
# Set environment variables
export RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
export PRIVATE_KEY="your-private-key-here"
export ETHERSCAN_API_KEY="your-etherscan-api-key"

# Or create .env file
echo "RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY" > .env
echo "PRIVATE_KEY=your-private-key-here" >> .env
echo "ETHERSCAN_API_KEY=your-etherscan-api-key" >> .env
```

#### 2. Contract Deployment

```bash
# Navigate to contracts directory
cd agrosafe-contracts

# Deploy to Sepolia testnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Verify contract on Etherscan
forge verify-contract \
  <CONTRACT_ADDRESS> \
  src/Agrosafe.sol:AgroSafe \
  --chain-id 11155111 \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

#### 3. Verify Deployment

```bash
# Check contract on Etherscan
# https://sepolia.etherscan.io/address/<CONTRACT_ADDRESS>

# Test basic functions
forge script script/TestDeployment.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### Alternative Testnets

#### Polygon Mumbai Testnet

```bash
# Set Mumbai RPC
export RPC_URL="https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY"
export PRIVATE_KEY="your-private-key-here"

# Deploy to Mumbai
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --chain-id 80001

# Verify on Polygonscan
forge verify-contract \
  <CONTRACT_ADDRESS> \
  src/Agrosafe.sol:AgroSafe \
  --chain-id 80001 \
  --etherscan-api-key $POLYGONSCAN_API_KEY
```

## Mainnet Deployment

### Ethereum Mainnet Deployment

#### 1. Pre-Deployment Checklist

- [ ] **Security Audit**: Complete smart contract audit
- [ ] **Gas Optimization**: Optimize contract for mainnet costs
- [ ] **Backup Plan**: Have rollback procedures ready
- [ ] **Team Coordination**: Coordinate with all stakeholders
- [ ] **Monitoring Setup**: Prepare monitoring tools

#### 2. Gas Optimization

```solidity
// Use constants for frequently used values
uint256 public constant MAX_ITEMS_PER_PAGE = 100;

// Use custom errors instead of require with strings
error InvalidParameter(string param);

// Optimize loops and mappings
```

#### 3. Multi-Signature Deployment

```bash
# Set up multi-sig wallet (recommended for production)
# Use Gnosis Safe or similar

# Deploy with multi-sig
forge script script/DeployMainnet.s.sol:DeployMainnet \
  --rpc-url $MAINNET_RPC \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify
```

#### 4. Deployment Script

```solidity
// script/DeployMainnet.s.sol
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Agrosafe.sol";

contract DeployMainnet is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.envAddress("OWNER_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy contract
        AgroSafe agroSafe = new AgroSafe(owner);
        
        console.log("AgroSafe deployed to:", address(agroSafe));
        console.log("Owner:", owner);
        
        vm.stopBroadcast();
        
        // Log deployment details
        emit log_named_address("Contract Address", address(agroSafe));
        emit log_named_address("Owner", owner);
        emit log_named_uint("Block Number", block.number);
    }
}
```

## Frontend Deployment

### Vercel Deployment

#### 1. Prepare Environment

```bash
# Set production environment variables
VITE_CONTRACT_ADDRESS=0x... # Your deployed contract address
VITE_CHAIN_ID=1 # Mainnet chain ID
VITE_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
```

#### 2. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd agrosafe-frontend
vercel --prod

# Set environment variables
vercel env add VITE_CONTRACT_ADDRESS
vercel env add VITE_CHAIN_ID add VITE_R
vercel envPC_URL
```

#### 3. Deploy via GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      working-directory: agrosafe-frontend
      
    - name: Build
      run: npm run build
      working-directory: agrosafe-frontend
      env:
        VITE_CONTRACT_ADDRESS: ${{ secrets.VITE_CONTRACT_ADDRESS }}
        VITE_CHAIN_ID: ${{ secrets.VITE_CHAIN_ID }}
        VITE_RPC_URL: ${{ secrets.VITE_RPC_URL }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: agrosafe-frontend
```

### Netlify Deployment

#### 1. Build Configuration

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## Environment Configuration

### Smart Contract Environment Variables

```bash
# .env file for contracts
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key
OWNER_ADDRESS=0x... # Your wallet address
```

### Frontend Environment Variables

```bash
# Development (.env.local)
VITE_CONTRACT_ADDRESS=http://localhost:8545
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://localhost:8545

# Testnet (.env.staging)
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Production (.env.production)
VITE_CONTRACT_ADDRESS=0x...
VITE_CHAIN_ID=1
VITE_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### Configuration Validation

```typescript
// utils/config.ts
export const validateConfig = () => {
  const required = [
    'VITE_CONTRACT_ADDRESS',
    'VITE_CHAIN_ID',
    'VITE_RPC_URL'
  ];
  
  for (const env of required) {
    if (!import.meta.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
};
```

## Security Considerations

### Private Key Management

1. **Never commit private keys**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   *.key
   ```

2. **Use secure storage**
   - Hardware wallets for production
   - Encrypted storage for development
   - Environment variables for CI/CD

3. **Key rotation**
   - Regular key rotation schedule
   - Multiple key management
   - Access logging

1. **

### Contract SecurityAccess Control**
   - Owner-only critical functions
   - Multi-signature for production
   - Role-based permissions

2. **Emergency Controls**
   - Pause functionality
   - Emergency response plan
   - Communication protocols

3. **Testing**
   - Comprehensive test suite
   - Security audit
   - Testnet testing

### Frontend Security

1. **Environment Variables**
   - No sensitive data in frontend
   - Proper environment separation
   - Input validation

2. **Wallet Security**
   - No private key storage
   - Secure wallet interactions
   - User education

## Monitoring and Maintenance

### Contract Monitoring

```bash
# Monitor contract events
cast logs --address <CONTRACT_ADDRESS> --rpc-url $RPC_URL

# Check contract status
cast call <CONTRACT_ADDRESS> "totalFarmers()" --rpc-url $RPC_URL
```

### Frontend Monitoring

1. **Error Tracking**
   - Sentry for error monitoring
   - Custom analytics
   - User feedback

2. **Performance Monitoring**
   - Page load times
   - Transaction success rates
   - User engagement

### Automated Backups

```bash
# Script to backup important data
#!/bin/bash
# backup.sh

# Backup contract ABIs
cp src/abi/AgroSafe.json backups/abi-$(date +%Y%m%d).json

# Backup deployment information
echo "Contract deployed at: $(date)" >> backups/deployment.log
echo "Address: $CONTRACT_ADDRESS" >> backups/deployment.log

# Backup frontend builds
tar -czf backups/frontend-$(date +%Y%m%d).tar.gz dist/
```

## Troubleshooting

### Common Deployment Issues

#### Contract Deployment Failed

**Issue**: Out of gas or transaction reverted
**Solutions**:
1. Check gas limit and price
2. Verify constructor parameters
3. Check network congestion
4. Review contract code for issues

#### Frontend Build Errors

**Issue**: Environment variables not loaded
**Solutions**:
1. Check .env file location
2. Verify variable names (VITE_ prefix)
3. Restart development server
4. Clear build cache

#### Wallet Connection Issues

**Issue**: Cannot connect to deployed contract
**Solutions**:
1. Verify contract address
2. Check network configuration
3. Ensure contract is verified
4. Test with different wallets

### Network Issues

#### RPC Provider Problems

**Issue**: RPC requests timing out
**Solutions**:
1. Switch to different RPC provider
2. Check rate limits
3. Monitor provider status
4. Implement fallback providers

#### Gas Price Fluctuations

**Issue**: High gas costs or failed transactions
**Solutions**:
1. Monitor gas prices
2. Use gas estimation
3. Set appropriate gas limits
4. Time deployments strategically

### Recovery Procedures

#### Contract Rollback

```bash
# If critical issue discovered after deployment
# Note: Immutable contracts cannot be rolled back
# Plan: Deploy new contract and migrate data

# Emergency pause
cast send <CONTRACT_ADDRESS> "pause()" --private-key $PRIVATE_KEY --rpc-url $RPC_URL

# Communicate with users
# Prepare migration plan
# Deploy updated contract
```

#### Frontend Rollback

```bash
# Vercel rollback
vercel rollback <deployment-url>

# Netlify rollback
netlify rollback --site=<site-id>

# Git-based rollback
git revert <commit-hash>
git push origin main
```

### Getting Help

1. **Check logs** for detailed error messages
2. **Verify configuration** against examples
3. **Test locally** before deploying
4. **Community support** via GitHub Issues
5. **Professional support** for production issues

---

*Keep this guide updated with new deployment procedures and lessons learned from actual deployments.*