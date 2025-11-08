// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
  AgroSafe Sols - compact single-file implementation for quick prototyping.
  - FarmerRegistry: register & verify farmers
  - ProductTracking: register products & their lifecycle events
  - PaymentManager: escrow payments between buyer and farmer
  - InsuranceManager: file claims and resolve them
  - All contracts are Ownable (admin actions reserved)
*/

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";

/// @title FarmerRegistry
/// @notice Register farmers and manage verification status
contract FarmerRegistry is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _farmerIds;

    struct Farmer {
        uint256 id;
        address wallet;
        string name;
        string location;
        bool verified;
        uint256 createdAt;
    }

    mapping(uint256 => Farmer) public farmersById;
    mapping(address => uint256) public farmerIdByAddress;

    event FarmerRegistered(uint256 indexed farmerId, address indexed wallet, string name);
    event FarmerVerified(uint256 indexed farmerId, bool verified);

    /// @notice Register a farmer (anyone can call to register their wallet)
    function registerFarmer(string calldata name, string calldata location) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(farmerIdByAddress[msg.sender] == 0, "Already registered");

        _farmerIds.increment();
        uint256 newId = _farmerIds.current();

        Farmer memory f = Farmer({
            id: newId,
            wallet: msg.sender,
            name: name,
            location: location,
            verified: false,
            createdAt: block.timestamp
        });

        farmersById[newId] = f;
        farmerIdByAddress[msg.sender] = newId;

        emit FarmerRegistered(newId, msg.sender, name);
        return newId;
    }

    /// @notice Admin verifies a farmer (onlyOwner)
    function verifyFarmer(uint256 farmerId, bool verified) external onlyOwner {
        require(farmerId != 0 && farmerId <= _farmerIds.current(), "Invalid farmerId");
        farmersById[farmerId].verified = verified;
        emit FarmerVerified(farmerId, verified);
    }

    /// @notice Helper: get farmer id for an address
    function getFarmerId(address wallet) external view returns (uint256) {
        return farmerIdByAddress[wallet];
    }
}

/// @title ProductTracking
/// @notice Register products, batches and logs product lifecycle events
contract ProductTracking is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _productIds;
    Counters.Counter private _batchIds;

    FarmerRegistry public registry;

    constructor(address registryAddress) {
        require(registryAddress != address(0), "Zero registry address");
        registry = FarmerRegistry(registryAddress);
    }

    enum ProductState { Harvested, Packed, InTransit, Delivered, Sold, Recalled }

    struct Product {
        uint256 productId;
        uint256 farmerId;
        string name;         // e.g., "Tomatoes"
        string metadataCID;  // e.g., IPFS CID or off-chain pointer
        uint256 createdAt;
    }

    struct Batch {
        uint256 batchId;
        uint256 productId;
        string batchCode;    // human-readable batch code / QR
        ProductState state;
        uint256 quantity;
        uint256 createdAt;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Batch) public batches;

    // productId -> list of batchIds is omitted for gas simplicity; you can index off-chain
    event ProductRegistered(uint256 indexed productId, uint256 indexed farmerId, string name, string metadataCID);
    event BatchCreated(uint256 indexed batchId, uint256 indexed productId, string batchCode, uint256 quantity);
    event BatchStateUpdated(uint256 indexed batchId, ProductState newState, uint256 timestamp);

    modifier onlyVerifiedFarmer() {
        uint256 fid = registry.farmerIdByAddress(msg.sender);
        require(fid != 0, "Not registered farmer");
        require(registry.farmersById(fid).verified, "Farmer not verified");
        _;
    }

    /// @notice Farmer registers a product type (only verified farmers)
    function registerProduct(string calldata name, string calldata metadataCID) external onlyVerifiedFarmer returns (uint256) {
        require(bytes(name).length > 0, "Product name required");

        uint256 farmerId = registry.farmerIdByAddress(msg.sender);

        _productIds.increment();
        uint256 pid = _productIds.current();

        products[pid] = Product({
            productId: pid,
            farmerId: farmerId,
            name: name,
            metadataCID: metadataCID,
            createdAt: block.timestamp
        });

        emit ProductRegistered(pid, farmerId, name, metadataCID);
        return pid;
    }

    /// @notice Create a new batch for a product (unique batchCode used for QR scanning)
    function createBatch(uint256 productId, string calldata batchCode, uint256 quantity) external onlyVerifiedFarmer returns (uint256) {
        require(productId != 0 && productId <= _productIds.current(), "Invalid productId");
        require(bytes(batchCode).length > 0, "batchCode required");

        // Ensure caller is the product's farmer
        uint256 farmerId = registry.farmerIdByAddress(msg.sender);
        require(products[productId].farmerId == farmerId, "Not owner of product");

        _batchIds.increment();
        uint256 bid = _batchIds.current();

        batches[bid] = Batch({
            batchId: bid,
            productId: productId,
            batchCode: batchCode,
            state: ProductState.Harvested,
            quantity: quantity,
            createdAt: block.timestamp
        });

        emit BatchCreated(bid, productId, batchCode, quantity);
        return bid;
    }

    /// @notice Update batch lifecycle state (farmer or owner/authorized)
    function updateBatchState(uint256 batchId, ProductState newState) external {
        require(batchId != 0 && batchId <= _batchIds.current(), "Invalid batchId");

        // For prototype: allow farmer of the product or owner/admin to update
        uint256 pid = batches[batchId].productId;
        uint256 farmerId = products[pid].farmerId;
        address farmerAddr = registry.farmersById(farmerId).wallet;

        require(msg.sender == farmerAddr || msg.sender == owner(), "Not authorized to update");

        batches[batchId].state = newState;
        emit BatchStateUpdated(batchId, newState, block.timestamp);
    }

    /// @notice Lookup batch by batchCode (off-chain listeners will likely index this)
    function findBatchById(uint256 batchId) external view returns (Batch memory) {
        return batches[batchId];
    }
}

/// @title PaymentManager
/// @notice Escrow payments from buyer to farmer for a batch/product. Owner acts as admin/arbiter.
contract PaymentManager is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _escrowIds;

    ProductTracking public tracker;
    FarmerRegistry public registry;

    constructor(address trackerAddr, address registryAddr) {
        require(trackerAddr != address(0) && registryAddr != address(0), "Zero addresses");
        tracker = ProductTracking(trackerAddr);
        registry = FarmerRegistry(registryAddr);
    }

    enum EscrowState { Created, Funded, Released, Refunded }

    struct Escrow {
        uint256 escrowId;
        uint256 batchId;
        address buyer;
        address farmer;
        uint256 amount; // in wei
        EscrowState state;
        uint256 createdAt;
    }

    mapping(uint256 => Escrow) public escrows;

    event EscrowCreated(uint256 indexed escrowId, uint256 indexed batchId, address indexed buyer, address farmer, uint256 amount);
    event EscrowFunded(uint256 indexed escrowId);
    event EscrowReleased(uint256 indexed escrowId, address to, uint256 amount);
    event EscrowRefunded(uint256 indexed escrowId, address to, uint256 amount);

    /// @notice Buyer creates escrow for a batch; funds are sent in same tx
    function createAndFundEscrow(uint256 batchId) external payable returns (uint256) {
        require(batchId != 0, "Invalid batchId");
        require(msg.value > 0, "Pay amount");

        // find product and farmer
        ProductTracking.Batch memory b = tracker.batches(batchId);
        uint256 pid = b.productId;
        uint256 farmerId = tracker.products(pid).farmerId;
        address farmerAddr = registry.farmersById(farmerId).wallet;
        require(farmerAddr != address(0), "Farmer not found");

        _escrowIds.increment();
        uint256 eid = _escrowIds.current();

        escrows[eid] = Escrow({
            escrowId: eid,
            batchId: batchId,
            buyer: msg.sender,
            farmer: farmerAddr,
            amount: msg.value,
            state: EscrowState.Funded,
            createdAt: block.timestamp
        });

        emit EscrowCreated(eid, batchId, msg.sender, farmerAddr, msg.value);
        emit EscrowFunded(eid);
        return eid;
    }

    /// @notice Release funds to farmer (can be called by owner as arbiter or by buyer)
    function releaseEscrow(uint256 escrowId) external {
        Escrow storage e = escrows[escrowId];
        require(e.escrowId != 0, "Escrow not found");
        require(e.state == EscrowState.Funded, "Not fundable");

        // buyer or admin can release
        require(msg.sender == e.buyer || msg.sender == owner(), "Not authorized");

        e.state = EscrowState.Released;
        uint256 amount = e.amount;
        address payable to = payable(e.farmer);
        e.amount = 0;

        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Transfer failed");

        emit EscrowReleased(escrowId, to, amount);
    }

    /// @notice Refund funds to buyer (admin only)
    function refundEscrow(uint256 escrowId) external onlyOwner {
        Escrow storage e = escrows[escrowId];
        require(e.escrowId != 0, "Escrow not found");
        require(e.state == EscrowState.Funded, "Not refundable");

        e.state = EscrowState.Refunded;
        uint256 amount = e.amount;
        address payable to = payable(e.buyer);
        e.amount = 0;

        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Refund failed");
        emit EscrowRefunded(escrowId, to, amount);
    }

    // view helpers
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return escrows[escrowId];
    }
}

/// @title InsuranceManager
/// @notice Farmers (or platform) can enable basic claim filing and admin resolution.
/// @dev This is a prototype; production insurance requires off-chain oracles & regulated partners.
contract InsuranceManager is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _claimIds;

    FarmerRegistry public registry;
    ProductTracking public tracker;

    constructor(address registryAddr, address trackerAddr) {
        require(registryAddr != address(0) && trackerAddr != address(0), "Zero addrs");
        registry = FarmerRegistry(registryAddr);
        tracker = ProductTracking(trackerAddr);
    }

    enum ClaimState { Filed, Investigating, Approved, Rejected, Paid }

    struct Claim {
        uint256 claimId;
        uint256 batchId;
        uint256 farmerId;
        address farmer;
        string evidenceCID; // IPFS evidence
        uint256 amount; // amount requested
        ClaimState state;
        uint256 createdAt;
    }

    mapping(uint256 => Claim) public claims;

    event ClaimFiled(uint256 indexed claimId, uint256 indexed batchId, uint256 farmerId, address farmer, uint256 amount);
    event ClaimStateChanged(uint256 indexed claimId, ClaimState newState);
    event ClaimPaid(uint256 indexed claimId, address to, uint256 amount);

    /// @notice Farmer files a claim for a batch (must be owner)
    function fileClaim(uint256 batchId, string calldata evidenceCID, uint256 amount) external returns (uint256) {
        require(batchId != 0, "Invalid batchId");
        require(amount > 0, "Amount required");

        // Verify caller is farmer who owns the product batch
        ProductTracking.Batch memory b = tracker.batches(batchId);
        uint256 pid = b.productId;
        uint256 farmerId = tracker.products(pid).farmerId;
        address farmerAddr = registry.farmersById(farmerId).wallet;
        require(msg.sender == farmerAddr, "Not farmer owner");

        _claimIds.increment();
        uint256 cid = _claimIds.current();

        claims[cid] = Claim({
            claimId: cid,
            batchId: batchId,
            farmerId: farmerId,
            farmer: farmerAddr,
            evidenceCID: evidenceCID,
            amount: amount,
            state: ClaimState.Filed,
            createdAt: block.timestamp
        });

        emit ClaimFiled(cid, batchId, farmerId, farmerAddr, amount);
        return cid;
    }

    /// @notice Admin updates claim state (Investigating / Approved / Rejected)
    function updateClaimState(uint256 claimId, ClaimState newState) external onlyOwner {
        require(claims[claimId].claimId != 0, "Claim not found");
        claims[claimId].state = newState;
        emit ClaimStateChanged(claimId, newState);
    }

    /// @notice Admin pays approved claim (transfers funds from contract)
    function payClaim(uint256 claimId) external onlyOwner {
        Claim storage c = claims[claimId];
        require(c.claimId != 0, "Claim not found");
        require(c.state == ClaimState.Approved, "Claim not approved");
        require(address(this).balance >= c.amount, "Insufficient funds in InsuranceManager");

        c.state = ClaimState.Paid;
        uint256 amount = c.amount;
        c.amount = 0;

        (bool ok, ) = payable(c.farmer).call{value: amount}("");
        require(ok, "Payment failed");

        emit ClaimPaid(claimId, c.farmer, amount);
    }

    /// @notice Allow the contract to receive funds for payouts (owner can top-up)
    receive() external payable {}
    fallback() external payable {}
}
