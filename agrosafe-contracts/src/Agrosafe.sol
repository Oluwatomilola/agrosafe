// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgroSafe
 * @dev Registry and verification contract for farmers and produce with pagination support.
 * Uses native uint counters instead of Counters.sol.
 */
contract AgroSafe is Ownable, ReentrancyGuard {
    /// @dev Maximum number of items that can be retrieved in a single paginated call
    uint256 public constant MAX_ITEMS_PER_PAGE = 100;
    /// @dev Error for zero address validation
    error ZeroAddressNotAllowed(address invalidAddress);

    /// @dev Modifier to check for zero address
    modifier notZeroAddress(address addr) {
        if (addr == address(0)) {
            revert ZeroAddressNotAllowed(addr);
        }
        _;
    }
    uint256 private _farmerIds;
    uint256 private _produceIds;

    struct Farmer {
        uint256 id;
        string name;
        address wallet;
        string location;
        bool verified;
    }

    struct Produce {
        uint256 id;
        uint256 farmerId;
        string cropType;
        string harvestDate;
        bool certified;
    }

    mapping(uint256 => Farmer) public farmers;
    mapping(address => uint256) public farmerIdsByWallet;
    mapping(uint256 => Produce) public produce;

    event FarmerRegistered(uint256 indexed id, string name, address wallet);
    event FarmerVerified(uint256 indexed id, bool status);
    event ProduceRecorded(uint256 indexed id, uint256 farmerId, string cropType);
    event ProduceCertified(uint256 indexed id, bool certified);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     * @param initialOwner The address to set as the initial owner of the contract.
     */
    constructor(address initialOwner) Ownable(initialOwner) notZeroAddress(initialOwner) {}

    /**
     * @notice Register a new farmer
     */
    function registerFarmer(string memory name, string memory location) external nonReentrant {
        require(farmerIdsByWallet[msg.sender] == 0, "Farmer already registered");

        _farmerIds++;
        uint256 newId = _farmerIds;

        farmers[newId] = Farmer({
            id: newId,
            name: name,
            wallet: msg.sender,
            location: location,
            verified: false
        });

        farmerIdsByWallet[msg.sender] = newId;

        emit FarmerRegistered(newId, name, msg.sender);
    }

    /**
     * @notice Verify a farmer (only owner/admin)
     * @param farmerId The ID of the farmer to verify
     * @param status The verification status to set
     */
    function verifyFarmer(uint256 farmerId, bool status) external onlyOwner nonReentrant {
        require(farmerId != 0, "Invalid farmer ID");
        require(farmers[farmerId].id != 0, "Farmer not found");
        
        address farmerAddress = farmers[farmerId].wallet;
        require(farmerAddress != address(0), "Invalid farmer address");
        
        farmers[farmerId].verified = status;
        emit FarmerVerified(farmerId, status);
    }

    /**
     * @notice Record a produce linked to a farmer
     * @param cropType The type of crop being recorded
     * @param harvestDate The harvest date of the produce
     */
    function recordProduce(string memory cropType, string memory harvestDate) external notZeroAddress(msg.sender) nonReentrant {
        uint256 farmerId = farmerIdsByWallet[msg.sender];
        require(farmerId != 0, "Farmer not registered");
        require(farmers[farmerId].verified, "Farmer not verified");

        _produceIds++;
        uint256 produceId = _produceIds;

        produce[produceId] = Produce({
            id: produceId,
            farmerId: farmerId,
            cropType: cropType,
            harvestDate: harvestDate,
            certified: false
        });

        emit ProduceRecorded(produceId, farmerId, cropType);
    }

    /**
     * @notice Certify produce (only owner/admin)
     * @param produceId The ID of the produce to certify
     * @param certified The certification status to set
     */
    function certifyProduce(uint256 produceId, bool certified) external onlyOwner nonReentrant {
        require(produceId != 0, "Invalid produce ID");
        require(produce[produceId].id != 0, "Produce not found");
        produce[produceId].certified = certified;
        emit ProduceCertified(produceId, certified);
    }

    /**
     * @notice Get total number of registered farmers
     * @return Total count of farmers
     */
    function totalFarmers() external view returns (uint256) {
        return _farmerIds;
    }

    /**
     * @notice Get total number of recorded produce items
     * @return Total count of produce items
     */
    function totalProduce() external view returns (uint256) {
        return _produceIds;
    }

    /**
     * @notice Get a paginated list of farmers
     * @param offset Starting index (0-based)
     * @param limit Maximum number of items to return (max 100)
     * @return Array of Farmer structs
     */
    function getFarmersPaginated(uint256 offset, uint256 limit) external view returns (Farmer[] memory) {
        require(limit > 0 && limit <= MAX_ITEMS_PER_PAGE, "Invalid limit");
        require(offset < _farmerIds, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > _farmerIds) {
            end = _farmerIds;
        }
        
        Farmer[] memory result = new Farmer[](end - offset);
        
        uint256 resultIndex = 0;
        for (uint256 i = offset + 1; i <= end; i++) {
            result[resultIndex] = farmers[i];
            resultIndex++;
        }
        
        return result;
    }
    
    /**
     * @notice Get a paginated list of produce items
     * @param offset Starting index (0-based)
     * @param limit Maximum number of items to return (max 100)
     * @return Array of Produce structs
     */
    function getProducePaginated(uint256 offset, uint256 limit) external view returns (Produce[] memory) {
        require(limit > 0 && limit <= MAX_ITEMS_PER_PAGE, "Invalid limit");
        require(offset < _produceIds, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > _produceIds) {
            end = _produceIds;
        }
        
        Produce[] memory result = new Produce[](end - offset);
        
        uint256 resultIndex = 0;
        for (uint256 i = offset + 1; i <= end; i++) {
            result[resultIndex] = produce[i];
            resultIndex++;
        }
        
        return result;
    }
    
    /**
     * @notice Get a paginated list of produce items for a specific farmer
     * @param farmerId The ID of the farmer
     * @param offset Starting index (0-based)
     * @param limit Maximum number of items to return (max 100)
     * @return Array of Produce structs
     */
    function getProduceByFarmerPaginated(
        uint256 farmerId, 
        uint256 offset, 
        uint256 limit
    ) external view returns (Produce[] memory) {
        require(limit > 0 && limit <= MAX_ITEMS_PER_PAGE, "Invalid limit");
        require(farmerId != 0 && farmers[farmerId].id != 0, "Invalid farmer ID");
        
        // First pass: count matching items
        uint256 matchCount = 0;
        for (uint256 i = 1; i <= _produceIds; i++) {
            if (produce[i].farmerId == farmerId) {
                if (matchCount >= offset) {
                    if (matchCount - offset >= limit) break;
                }
                matchCount++;
            }
        }
        
        // Adjust matchCount based on offset and limit
        if (offset >= matchCount) {
            return new Produce[](0);
        }
        
        uint256 resultSize = matchCount - offset;
        if (resultSize > limit) {
            resultSize = limit;
        }
        
        // Second pass: collect matching items
        Produce[] memory result = new Produce[](resultSize);
        uint256 resultIndex = 0;
        uint256 currentMatch = 0;
        
        for (uint256 i = 1; i <= _produceIds && resultIndex < resultSize; i++) {
            if (produce[i].farmerId == farmerId) {
                if (currentMatch >= offset) {
                    result[resultIndex] = produce[i];
                    resultIndex++;
                }
                currentMatch++;
            }
        }
        
        return result;
    }
}
