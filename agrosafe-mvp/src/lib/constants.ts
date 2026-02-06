// AgroSafe Contract Configuration
export const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c37f3C54f8b0e6db";

// Mock data for demo purposes
export const MOCK_FARMER = {
  id: "AGR-2024-001",
  walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0Ab3e",
  name: "John Adebayo",
  farmName: "Green Valley Farms",
  location: "Oyo State, Nigeria",
  farmSize: "25 hectares",
  registeredAt: "2024-01-15",
  verified: true,
};

export const MOCK_BATCHES = [
  {
    id: "BATCH-001",
    produceType: "Maize",
    quantity: "500 kg",
    harvestDate: "2024-03-15",
    location: "Field A",
    txHash: "0x1234...5678",
    status: "verified",
    timestamp: "2024-03-16T10:30:00Z",
  },
  {
    id: "BATCH-002",
    produceType: "Cassava",
    quantity: "1200 kg",
    harvestDate: "2024-02-28",
    location: "Field B",
    txHash: "0xabcd...ef01",
    status: "verified",
    timestamp: "2024-03-01T14:15:00Z",
  },
  {
    id: "BATCH-003",
    produceType: "Tomatoes",
    quantity: "300 kg",
    harvestDate: "2024-03-20",
    location: "Greenhouse 1",
    txHash: "0x9876...5432",
    status: "pending",
    timestamp: "2024-03-20T08:45:00Z",
  },
];
