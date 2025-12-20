# 🌾 AgroSafe - Blockchain Agricultural Traceability Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://solidity.readthedocs.io/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)

> **AgroSafe** is a comprehensive blockchain-based agricultural traceability platform that enables transparent tracking and verification of agricultural products from farm to consumer, ensuring food safety and supply chain integrity.

## 🚀 Features

### Core Functionality
- **👨‍🌾 Farmer Registration & Verification**: Secure registration system for farmers with admin verification
- **📦 Produce Tracking**: Record and track agricultural produce with harvest date information  
- **✅ Product Certification**: Admin-controlled certification system for verified products
- **📊 Pagination Support**: Efficient data retrieval for large-scale operations
- **🛡️ Security Features**: Reentrancy protection, input validation, and emergency pause functionality

### Technical Features
- **🔗 Blockchain-Based**: Built on Ethereum for immutable record keeping
- **🌐 Web3 Integration**: Modern React frontend with Web3 wallet connectivity
- **📱 Responsive Design**: Mobile-friendly interface for farmers and administrators
- **🔍 Traceability**: Complete supply chain visibility from farm to table

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   Blockchain    │
│   (React/TS)    │◄──►│   Contract      │◄──►│   (Ethereum)    │
│                 │    │   (Solidity)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Events &      │◄─────────────┘
                        │   Logging       │
                        └─────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **MetaMask** or compatible Web3 wallet (for frontend testing)
- **Foundry** (for smart contract development)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/agrosafe.git
cd agrosafe
```

### 2. Smart Contract Setup

```bash
# Navigate to contracts directory
cd agrosafe-contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../agrosafe-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your environment variables (see Configuration section)
```

## ⚙️ Configuration

### Smart Contract Environment

Create a `.env` file in the `agrosafe-contracts` directory:

```env
# Network Configuration
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=your-private-key-here
ETHERSCAN_API_KEY=your-etherscan-api-key

# Deployment
CONTRACT_ADDRESS= # Filled after deployment
```

### Frontend Environment

Create a `.env` file in the `agrosafe-frontend` directory:

```env
# API Configuration
VITE_CONTRACT_ADDRESS=your-deployed-contract-address
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key

# App Configuration
VITE_APP_NAME=AgroSafe
VITE_APP_VERSION=1.0.0
```

## 🚀 Quick Start

### 1. Deploy Smart Contracts

```bash
cd agrosafe-contracts

# Deploy to testnet
forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast

# Verify on Etherscan (optional)
forge verify-contract <CONTRACT_ADDRESS> src/Agrosafe.sol:AgroSafe --chain-id 11155111 --etherscan-api-key $ETHERSCAN_API_KEY
```

### 2. Start Frontend Development Server

```bash
cd agrosafe-frontend

# Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

### 3. Connect Your Wallet

1. Install MetaMask or compatible wallet
2. Switch to the Sepolia testnet
3. Import test account or create new one
4. Connect wallet to the application

## 📖 Usage Guide

### For Farmers

1. **Register Account**
   - Click "Register as Farmer"
   - Fill in your name and location
   - Submit registration

2. **Wait for Verification**
   - Admin must verify your account before you can record produce
   - Check your status in the dashboard

3. **Record Produce**
   - Once verified, navigate to "Record Produce"
   - Enter crop type and harvest date
   - Submit to add to blockchain

### For Administrators

1. **Verify Farmers**
   - Access admin panel
   - Review pending farmer registrations
   - Approve or reject applications

2. **Certify Produce**
   - Review recorded produce
   - Mark items as certified
   - Update certification status as needed

## 🧪 Testing

### Smart Contract Tests

```bash
cd agrosafe-contracts

# Run all tests
forge test

# Run with verbose output
forge test -vv

# Run specific test file
forge test --match-path test/AgroSafe.t.sol

# Generate test coverage report
forge coverage
```

### Frontend Tests

```bash
cd agrosafe-frontend

# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

## 📚 API Documentation

### Smart Contract Functions

#### Farmer Management

```solidity
/// @notice Register a new farmer
/// @param name Farmer's full name (2-100 chars)
/// @param location Farmer's location (3-200 chars)
function registerFarmer(string name, string location) external;

/// @notice Verify a farmer (admin only)
/// @param farmerId ID of farmer to verify
/// @param status Verification status
function verifyFarmer(uint256 farmerId, bool status) external;
```

#### Produce Management

```solidity
/// @notice Record new produce (verified farmers only)
/// @param cropType Type of crop (2-50 chars)
/// @param harvestDate Harvest date in YYYY-MM-DD format
/// @return produceId ID of newly created produce record
function recordProduce(string cropType, string harvestDate) external returns (uint256);

/// @notice Certify produce (admin only)
/// @param produceId ID of produce to certify
/// @param certified Certification status
function certifyProduce(uint256 produceId, bool certified) external;
```

#### Data Retrieval

```solidity
/// @notice Get paginated list of farmers
/// @param offset Starting index (0-based)
/// @param limit Number of items (max 100)
/// @return Array of Farmer structs
function getFarmersPaginated(uint256 offset, uint256 limit) external view returns (Farmer[] memory);

/// @notice Get paginated list of produce
/// @param offset Starting index (0-based) 
/// @param limit Number of items (max 100)
/// @return Array of Produce structs
function getProducePaginated(uint256 offset, uint256 limit) external view returns (Produce[] memory);
```

### Events

```solidity
/// @dev Emitted when farmer registers
event FarmerRegistered(uint256 indexed id, string name, address wallet);

/// @dev Emitted when farmer verification status changes
event FarmerVerified(uint256 indexed id, bool status);

/// @dev Emitted when produce is recorded
event ProduceRecorded(uint256 indexed id, uint256 farmerId, string cropType);

/// @dev Emitted when produce certification status changes
event ProduceCertified(uint256 indexed id, bool certified);
```

## 🔒 Security Considerations

### Smart Contract Security
- **Reentrancy Protection**: All state-changing functions use `nonReentrant` modifier
- **Input Validation**: Comprehensive string length and format validation
- **Access Control**: Owner-only functions for critical operations
- **Emergency Stop**: Pausable contract for emergency situations
- **Custom Errors**: Gas-efficient error handling with detailed information

### Best Practices
- Always verify farmer credentials before produce recording
- Use secure private keys for deployment and admin functions
- Regularly update dependencies and audit smart contracts
- Implement proper key management for production deployments

## 🚀 Deployment

### Mainnet Deployment

1. **Prepare Environment**
   ```bash
   # Set mainnet RPC and private key
   export RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
   export PRIVATE_KEY=your-mainnet-private-key
   ```

2. **Deploy Contracts**
   ```bash
   forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
   ```

3. **Update Frontend Configuration**
   - Update contract address in frontend environment
   - Update chain ID to mainnet (1)
   - Update RPC endpoints

### Testnet Deployment

Follow the same process but use Sepolia testnet endpoints for testing.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **Smart Contracts**: Follow Solidity style guide and NatSpec conventions
- **Frontend**: Use TypeScript and follow React best practices
- **Testing**: Maintain >90% test coverage for critical functions
- **Documentation**: Update documentation for any API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code documentation
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join our GitHub Discussions for questions and ideas
- **Security**: Report security issues privately to security@agrosafe.com

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure contract patterns
- [Foundry](https://getfoundry.sh/) for modern Solidity development
- [React](https://reactjs.org/) and the Web3 ecosystem for frontend tools

## 📈 Roadmap

- [ ] **Multi-chain Support**: Deploy on Polygon, Arbitrum for lower fees
- [ ] **IPFS Integration**: Store produce images and documents on IPFS
- [ ] **QR Code Generation**: Generate QR codes for produce traceability
- [ ] **Mobile App**: Native mobile application for farmers
- [ ] **Advanced Analytics**: Dashboard with supply chain insights
- [ ] **API Gateway**: RESTful API for third-party integrations
- [ ] **Oracle Integration**: Price feeds and weather data integration

---

**Made with ❤️ by the AgroSafe Team**

For more information, visit our [website](https://agrosafe.example.com) or follow us on [Twitter](https://twitter.com/agrosafe).