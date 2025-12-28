# 🔌 AgroSafe API Documentation

This document provides comprehensive API documentation for the AgroSafe smart contract and frontend integration.

## Table of Contents

1. [Smart Contract API](#smart-contract-api)
2. [Frontend Integration](#frontend-integration)
3. [Error Handling](#error-handling)
4. [Event Reference](#event-reference)
5. [Type Definitions](#type-definitions)
6. [Code Examples](#code-examples)

## Smart Contract API

### Contract Information

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgroSafe
 * @dev Registry and verification contract for farmers and produce with pagination support
 * @notice This contract enables transparent tracking and verification of agricultural products
 */
contract AgroSafe is Ownable, ReentrancyGuard, Pausable {
    // Contract implementation...
}
```

### Constants

```solidity
/// @dev Maximum number of items that can be retrieved in a single paginated call
uint256 public constant MAX_ITEMS_PER_PAGE = 100;

/// @dev Constants for input validation
uint256 public constant MIN_NAME_LENGTH = 2;
uint256 public constant MAX_NAME_LENGTH = 100;
uint256 public constant MIN_LOCATION_LENGTH = 3;
uint256 public constant MAX_LOCATION_LENGTH = 200;
uint256 public constant MIN_CROP_TYPE_LENGTH = 2;
uint256 public constant MAX_CROP_TYPE_LENGTH = 50;
```

### Core Functions

#### Farmer Management

##### `registerFarmer`

Registers a new farmer in the system.

```solidity
/**
 * @notice Register a new farmer in the system
 * @dev Creates a new farmer record with unverified status
 * @param name The full name of the farmer (2-100 characters)
 * @param location The physical location/address of the farmer (3-200 characters)
 * @dev Emits FarmerRegistered event upon successful registration
 * @dev Reverts if farmer is already registered or inputs are invalid
 */
function registerFarmer(
    string memory name,
    string memory location
) external whenNotPaused nonReentrant;
```

**Parameters:**
- `name` (string): Farmer's full name, 2-100 characters
- `location` (string): Farmer's location, 3-200 characters

**Returns:** None

**Events:**
- `FarmerRegistered(uint256 indexed id, string name, address wallet)`

**Reverts:**
- `ZeroAddressNotAllowed` if msg.sender is zero address
- `StringTooShort` if name or location is too short
- `StringTooLong` if name or location is too long
- Custom require if farmer already registered

##### `verifyFarmer`

Verifies a farmer (admin only).

```solidity
/**
 * @notice Verify a farmer (only owner/admin)
 * @dev Sets the verification status of a registered farmer
 * @param farmerId The unique ID of the farmer to verify
 * @param status The verification status to set (true = verified, false = unverified)
 * @dev Emits FarmerVerified event upon status change
 * @dev Only callable by contract owner
 */
function verifyFarmer(
    uint256 farmerId,
    bool status
) external onlyOwner whenNotPaused nonReentrant;
```

**Parameters:**
- `farmerId` (uint256): Unique identifier of the farmer
- `status` (bool): Verification status to set

**Returns:** None

**Events:**
- `FarmerVerified(uint256 indexed id, bool status)`

**Reverts:**
- `onlyOwner` if not contract owner
- Custom require if farmer ID is invalid
- Custom require if farmer not found

#### Produce Management

##### `recordProduce`

Records new produce for a verified farmer.

```solidity
/**
 * @notice Record a new produce item
 * @dev Creates a produce record linked to the calling verified farmer
 * @param cropType The type of crop (2-50 characters)
 * @param harvestDate The harvest date in YYYY-MM-DD format
 * @return The unique ID of the newly recorded produce
 * @dev Emits ProduceRecorded event upon successful recording
 * @dev Only callable by verified farmers
 */
function recordProduce(
    string memory cropType,
    string memory harvestDate
) external whenNotPaused nonReentrant onlyVerifiedFarmer(msg.sender) returns (uint256);
```

**Parameters:**
- `cropType` (string): Type of crop, 2-50 characters
- `harvestDate` (string): Harvest date in YYYY-MM-DD format

**Returns:**
- `uint256`: Unique ID of the newly recorded produce

**Events:**
- `ProduceRecorded(uint256 indexed id, uint256 farmerId, string cropType)`

**Reverts:**
- `onlyVerifiedFarmer` if farmer not verified
- `StringTooShort` or `StringTooLong` if crop type validation fails
- `InvalidDateString` if harvest date format is invalid

##### `certifyProduce`

Certifies produce (admin only).

```solidity
/**
 * @notice Certify produce (only owner/admin)
 * @dev Sets the certification status of a produce item
 * @param produceId The unique ID of the produce to certify
 * @param certified The certification status to set (true = certified, false = not certified)
 * @dev Emits ProduceCertified event upon status change
 * @dev Only callable by contract owner
 */
function certifyProduce(
    uint256 produceId,
    bool certified
) external onlyOwner whenNotPaused nonReentrant;
```

**Parameters:**
- `produceId` (uint256): Unique identifier of the produce item
- `certified` (bool): Certification status to set

**Returns:** None

**Events:**
- `ProduceCertified(uint256 indexed id, bool certified)`

**Reverts:**
- `onlyOwner` if not contract owner
- Custom require if produce ID is invalid
- Custom require if produce not found

#### Data Retrieval Functions

##### `getFarmersPaginated`

Retrieves a paginated list of farmers.

```solidity
/**
 * @notice Get a paginated list of farmers
 * @param offset Starting index (0-based) for pagination
 * @param limit Maximum number of items to return (max 100)
 * @return Array of Farmer structs within the specified range
 * @dev Enables efficient data retrieval for large datasets
 * @dev Returns empty array if offset is out of bounds
 */
function getFarmersPaginated(
    uint256 offset,
    uint256 limit
) external view returns (Farmer[] memory);
```

**Parameters:**
- `offset` (uint256): Starting index (0-based)
- `limit` (uint256): Maximum number of items (max 100)

**Returns:**
- `Farmer[]`: Array of Farmer structs

**Reverts:**
- Custom require if limit is invalid
- Custom require if offset is out of bounds

##### `getProducePaginated`

Retrieves a paginated list of produce items.

```solidity
/**
 * @notice Get a paginated list of produce items
 * @param offset Starting index (0-based) for pagination
 * @param limit Maximum number of items to return (max 100)
 * @return Array of Produce structs within the specified range
 * @dev Enables efficient data retrieval for large datasets
 * @dev Returns empty array if offset is out of bounds
 */
function getProducePaginated(
    uint256 offset,
    uint256 limit
) external view returns (Produce[] memory);
```

**Parameters:**
- `offset` (uint256): Starting index (0-based)
- `limit` (uint256): Maximum number of items (max 100)

**Returns:**
- `Produce[]`: Array of Produce structs

##### `getProduceByFarmerPaginated`

Retrieves paginated produce items for a specific farmer.

```solidity
/**
 * @notice Get a paginated list of produce items for a specific farmer
 * @param farmerId The unique ID of the farmer
 * @param offset Starting index (0-based) for pagination
 * @param limit Maximum number of items to return (max 100)
 * @return Array of Produce structs belonging to the specified farmer
 * @dev Filters produce by farmer ID and applies pagination
 * @dev Returns empty array if farmer has no produce or offset is too high
 */
function getProduceByFarmerPaginated(
    uint256 farmerId,
    uint256 offset,
    uint256 limit
) external view returns (Produce[] memory);
```

**Parameters:**
- `farmerId` (uint256): Unique identifier of the farmer
- `offset` (uint256): Starting index (0-based)
- `limit` (uint256): Maximum number of items (max 100)

**Returns:**
- `Produce[]`: Array of Produce structs for the specified farmer

##### Utility Functions

```solidity
/**
 * @notice Get total number of registered farmers
 * @return Total count of farmers registered in the system
 */
function totalFarmers() external view returns (uint256);

/**
 * @notice Get total number of recorded produce items
 * @return Total count of produce items recorded in the system
 */
function totalProduce() external view returns (uint256);

/**
 * @notice Get farmer information by ID
 * @param farmerId Unique identifier of the farmer
 * @return Farmer struct containing farmer information
 */
function farmers(uint256 farmerId) external view returns (Farmer memory);

/**
 * @notice Get produce information by ID
 * @param produceId Unique identifier of the produce item
 * @return Produce struct containing produce information
 */
function produce(uint256 produceId) external view returns (Produce memory);
```

#### Administrative Functions

```solidity
/**
 * @notice Pause the contract (only owner)
 * @dev Prevents all state-changing operations when paused
 */
function pause() external onlyOwner;

/**
 * @notice Unpause the contract (only owner)
 * @dev Resumes normal contract operations
 */
function unpause() external onlyOwner;
```

## Frontend Integration

### React Hook Usage

#### useAgroSafe Hook

```typescript
import { useAgroSafe } from '../hooks/useAgroSafe';

function FarmerRegistration() {
    const { registerFarmer, getFarmer } = useAgroSafe();
    
    const handleRegister = async (name: string, location: string) => {
        try {
            const tx = await registerFarmer(name, location);
            console.log('Transaction confirmed:', tx.hash);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };
    
    const handleGetFarmer = async (farmerId: number) => {
        try {
            const farmer = await getFarmer(farmerId);
            console.log('Farmer data:', farmer);
        } catch (error) {
            console.error('Failed to get farmer:', error);
        }
    };
    
    return (
        // Component JSX...
    );
}
```

#### useWallet Hook

```typescript
import { useWallet } from '../hooks/useWallet';

function WalletConnector() {
    const { 
        address, 
        isConnected, 
        connect, 
        disconnect, 
        error 
    } = useWallet();
    
    if (!isConnected) {
        return (
            <button onClick={() => connect({ connector: injected() })}>
                Connect Wallet
            </button>
        );
    }
    
    return (
        <div>
            <p>Connected: {address}</p>
            <button onClick={disconnect}>Disconnect</button>
        </div>
    );
}
```

### Direct Contract Interaction

```typescript
import { useContract, useProvider } from 'wagmi';
import AgroSafeABI from '../abi/AgroSafe.json';

function ContractInteraction() {
    const provider = useProvider();
    const contract = useContract({
        address: '0x...', // Contract address
        abi: AgroSafeABI,
        signerOrProvider: provider,
    });
    
    const handleGetTotalFarmers = async () => {
        const total = await contract.totalFarmers();
        console.log('Total farmers:', total.toString());
    };
    
    return (
        <button onClick={handleGetTotalFarmers}>
            Get Total Farmers
        </button>
    );
}
```

## Error Handling

### Custom Errors

The contract uses custom errors for gas-efficient error handling:

```solidity
/// @custom:error ZeroAddressNotAllowed
error ZeroAddressNotAllowed(address invalidAddress);

/// @custom:error StringTooShort  
error StringTooShort(string field, uint256 minLength, uint256 actualLength);

/// @custom:error StringTooLong
error StringTooLong(string field, uint256 maxLength, uint256 actualLength);

/// @custom:error InvalidDateString
error InvalidDateString(string date);

/// @custom:error InvalidFarmerStatus
error InvalidFarmerStatus(bool requiredStatus, bool actualStatus);
```

### Frontend Error Handling

```typescript
// Type-safe error handling
interface ContractError {
    reason?: string;
    code?: string;
    method?: string;
    errorArgs?: any[];
}

const handleContractError = (error: any): string => {
    if (error.code === 4001) {
        return 'Transaction rejected by user';
    }
    
    if (error.code === -32603) {
        return 'Contract execution reverted';
    }
    
    if (error.message?.includes('Farmer not registered')) {
        return 'Farmer is not registered';
    }
    
    if (error.message?.includes('Farmer not verified')) {
        return 'Farmer is not verified';
    }
    
    return error.message || 'An unknown error occurred';
};

// Usage in components
try {
    await registerFarmer(name, location);
} catch (error) {
    const errorMessage = handleContractError(error);
    setError(errorMessage);
}
```

### Transaction Error Handling

```typescript
const sendTransaction = async (contractFunction: () => Promise<any>) => {
    try {
        setLoading(true);
        setError(null);
        
        const tx = await contractFunction();
        const receipt = await tx.wait();
        
        if (receipt.status === 0) {
            throw new Error('Transaction failed');
        }
        
        return receipt;
    } catch (error) {
        const errorMessage = handleContractError(error);
        setError(errorMessage);
        throw error;
    } finally {
        setLoading(false);
    }
};

// Usage
const handleRegister = async () => {
    await sendTransaction(() => registerFarmer(name, location));
};
```

## Event Reference

### Farmer Events

#### FarmerRegistered

Emitted when a new farmer registers.

```typescript
interface FarmerRegisteredEvent {
    id: bigint;      // Farmer ID
    name: string;    // Farmer name
    wallet: string;  // Farmer wallet address
}

contract.on('FarmerRegistered', (id, name, wallet) => {
    console.log('New farmer registered:', { id, name, wallet });
});
```

#### FarmerVerified

Emitted when a farmer's verification status changes.

```typescript
interface FarmerVerifiedEvent {
    id: bigint;      // Farmer ID
    status: boolean; // Verification status
}

contract.on('FarmerVerified', (id, status) => {
    console.log('Farmer verification changed:', { id, status });
});
```

### Produce Events

#### ProduceRecorded

Emitted when new produce is recorded.

```typescript
interface ProduceRecordedEvent {
    id: bigint;        // Produce ID
    farmerId: bigint;  // Farmer ID
    cropType: string;  // Crop type
}

contract.on('ProduceRecorded', (id, farmerId, cropType) => {
    console.log('New produce recorded:', { id, farmerId, cropType });
});
```

#### ProduceCertified

Emitted when produce certification status changes.

```typescript
interface ProduceCertifiedEvent {
    id: bigint;        // Produce ID
    certified: boolean; // Certification status
}

contract.on('ProduceCertified', (id, certified) => {
    console.log('Produce certification changed:', { id, certified });
});
```

### Event Filtering

```typescript
// Listen for events from specific address
contract.on('FarmerRegistered', { 
    filter: { wallet: userAddress },
    fromBlock: 'latest'
}, (id, name, wallet) => {
    console.log('Your registration confirmed:', { id, name });
});

// Listen for events in a block range
contract.queryFilter(
    'ProduceRecorded',
    startBlock,
    endBlock
).then(events => {
    console.log('All produce recorded in range:', events);
});
```

## Type Definitions

### Solidity Types to TypeScript

```typescript
// Farmer struct
interface Farmer {
    id: bigint;
    name: string;
    wallet: string;
    location: string;
    verified: boolean;
}

// Produce struct
interface Produce {
    id: bigint;
    farmerId: bigint;
    cropType: string;
    harvestDate: string;
    certified: boolean;
}

// Event types
interface FarmerRegisteredEvent {
    args: {
        id: bigint;
        name: string;
        wallet: string;
    };
}

interface FarmerVerifiedEvent {
    args: {
        id: bigint;
        status: boolean;
    };
}

interface ProduceRecordedEvent {
    args: {
        id: bigint;
        farmerId: bigint;
        cropType: string;
    };
}

interface ProduceCertifiedEvent {
    args: {
        id: bigint;
        certified: boolean;
    };
}
```

### Contract Function Types

```typescript
// Function signatures for type safety
interface AgroSafeContract {
    registerFarmer: (name: string, location: string) => Promise<TransactionResponse>;
    verifyFarmer: (farmerId: bigint, status: boolean) => Promise<TransactionResponse>;
    recordProduce: (cropType: string, harvestDate: string) => Promise<TransactionResponse>;
    certifyProduce: (produceId: bigint, certified: boolean) => Promise<TransactionResponse>;
    
    // View functions
    farmers: (farmerId: bigint) => Promise<Farmer>;
    produce: (produceId: bigint) => Promise<Produce>;
    totalFarmers: () => Promise<bigint>;
    totalProduce: () => Promise<bigint>;
    getFarmersPaginated: (offset: bigint, limit: bigint) => Promise<Farmer[]>;
    getProducePaginated: (offset: bigint, limit: bigint) => Promise<Produce[]>;
    getProduceByFarmerPaginated: (farmerId: bigint, offset: bigint, limit: bigint) => Promise<Produce[]>;
}
```

## Code Examples

### Complete Farmer Registration Flow

```typescript
import { useState } from 'react';
import { useAgroSafe } from '../hooks/useAgroSafe';
import { useWallet } from '../hooks/useWallet';

function FarmerRegistrationForm() {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const { registerFarmer } = useAgroSafe();
    const { address, isConnected } = useWallet();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isConnected) {
            setError('Please connect your wallet first');
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const tx = await registerFarmer(name.trim(), location.trim());
            console.log('Transaction sent:', tx.hash);
            
            const receipt = await tx.wait();
            if (receipt.status === 0) {
                throw new Error('Transaction failed');
            }
            
            setSuccess(true);
            setName('');
            setLocation('');
            
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={loading}
                />
            </div>
            
            <div>
                <label htmlFor="location">Location:</label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your farm location"
                    required
                    minLength={3}
                    maxLength={200}
                    disabled={loading}
                />
            </div>
            
            {error && <div className="error">{error}</div>}
            {success && <div className="success">Registration successful!</div>}
            
            <button 
                type="submit" 
                disabled={loading || !isConnected || !name.trim() || !location.trim()}
            >
                {loading ? 'Registering...' : 'Register Farmer'}
            </button>
        </form>
    );
}
```

### Complete Produce Recording Flow

```typescript
import { useState } from 'react';
import { useAgroSafe } from '../hooks/useAgroSafe';

function ProduceRecordingForm() {
    const [cropType, setCropType] = useState('');
    const [harvestDate, setHarvestDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [produceId, setProduceId] = useState<bigint | null>(null);
    
    const { recordProduce } = useAgroSafe();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const tx = await recordProduce(cropType.trim(), harvestDate);
            const receipt = await tx.wait();
            
            if (receipt.status === 0) {
                throw new Error('Transaction failed');
            }
            
            // Extract produce ID from events
            const event = receipt.logs.find(log => 
                log.address.toLowerCase() === contractAddress.toLowerCase()
            );
            
            if (event) {
                const produceId = event.args[0];
                setProduceId(produceId);
            }
            
            setSuccess(true);
            setCropType('');
            setHarvestDate('');
            
        } catch (error: any) {
            console.error('Record produce error:', error);
            setError(error.message || 'Recording failed');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="cropType">Crop Type:</label>
                <input
                    id="cropType"
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="e.g., Wheat, Corn, Rice"
                    required
                    minLength={2}
                    maxLength={50}
                    disabled={loading}
                />
            </div>
            
            <div>
                <label htmlFor="harvestDate">Harvest Date:</label>
                <input
                    id="harvestDate"
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            
            {error && <div className="error">{error}</div>}
            {success && (
                <div className="success">
                    Produce recorded successfully!
                    {produceId && ` Produce ID: ${produceId.toString()}`}
                </div>
            )}
            
            <button 
                type="submit" 
                disabled={loading || !cropType.trim() || !harvestDate}
            >
                {loading ? 'Recording...' : 'Record Produce'}
            </button>
        </form>
    );
}
```

### Data Display Component

```typescript
import { useEffect, useState } from 'react';
import { useAgroSafe } from '../hooks/useAgroSafe';

function FarmerList() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const { getFarmersPaginated, totalFarmers } = useAgroSafe();
    
    useEffect(() => {
        loadFarmers();
    }, []);
    
    const loadFarmers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const total = await totalFarmers();
            if (total === 0n) {
                setFarmers([]);
                return;
            }
            
            // Load first 10 farmers
            const farmerData = await getFarmersPaginated(0, 10);
            setFarmers(farmerData);
            
        } catch (error: any) {
            console.error('Failed to load farmers:', error);
            setError(error.message || 'Failed to load farmers');
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <div>Loading farmers...</div>;
    if (error) return <div className="error">{error}</div>;
    
    return (
        <div className="farmer-list">
            <h2>Registered Farmers ({farmers.length})</h2>
            
            {farmers.length === 0 ? (
                <p>No farmers registered yet.</p>
            ) : (
                <div className="farmers-grid">
                    {farmers.map((farmer) => (
                        <div key={farmer.id.toString()} className="farmer-card">
                            <h3>{farmer.name}</h3>
                            <p><strong>ID:</strong> {farmer.id.toString()}</p>
                            <p><strong>Location:</strong> {farmer.location}</p>
                            <p><strong>Wallet:</strong> {farmer.wallet}</p>
                            <p>
                                <strong>Status:</strong> 
                                <span className={farmer.verified ? 'verified' : 'unverified'}>
                                    {farmer.verified ? '✅ Verified' : '❌ Not Verified'}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
```

---

*This API documentation is continuously updated. For the latest information, check the smart contract source code and frontend implementation.*