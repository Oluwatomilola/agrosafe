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
    // Constants for validation
    uint256 public constant MIN_NAME_LENGTH = 2;
    uint256 public constant MAX_NAME_LENGTH = 100;
    uint256 public constant MIN_LOCATION_LENGTH = 3;
    uint256 public constant MAX_LOCATION_LENGTH = 200;
    uint256 public constant MIN_CROP_TYPE_LENGTH = 2;
    uint256 public constant MAX_CROP_TYPE_LENGTH = 50;
    uint256 public constant MIN_DATE_LENGTH = 10; // YYYY-MM-DD
    uint256 public constant MAX_DATE_LENGTH = 10; // YYYY-MM-DD
    
    // Custom errors
    error ZeroAddressNotAllowed(address invalidAddress);
    error StringTooShort(string field, uint256 minLength, uint256 actualLength);
    error StringTooLong(string field, uint256 maxLength, uint256 actualLength);
    error InvalidDateString(string date);
    error InvalidFarmerStatus(bool requiredStatus, bool actualStatus);
    
    /// @dev Modifier to check for zero address
    modifier notZeroAddress(address addr) {
        if (addr == address(0)) {
            revert ZeroAddressNotAllowed(addr);
        }
        _;
    }
    
    /// @dev Validates that a string's length is within the specified bounds
    modifier validStringLength(string memory str, uint256 minLen, uint256 maxLen, string memory field) {
        bytes memory strBytes = bytes(str);
        if (strBytes.length < minLen) {
            revert StringTooShort(field, minLen, strBytes.length);
        }
        if (strBytes.length > maxLen) {
            revert StringTooLong(field, maxLen, strBytes.length);
        }
        _;
    }
    
    /// @dev Validates a date string format (YYYY-MM-DD)
    modifier validDateString(string memory date) {
        bytes memory dateBytes = bytes(date);
        
        // Check length
        if (dateBytes.length != 10) {
            revert InvalidDateString(date);
        }
        
        // Check separators
        if (dateBytes[4] != '-' || dateBytes[7] != '-') {
            revert InvalidDateString(date);
        }
        
        // Check that all other characters are digits
        for (uint i = 0; i < dateBytes.length; i++) {
            // Skip separators
            if (i == 4 || i == 7) continue;
            
            // Check if character is a digit (0-9)
            if (dateBytes[i] < 0x30 || dateBytes[i] > 0x39) {
                revert InvalidDateString(date);
            }
        }
        
        // Additional validation for month (01-12) and day (01-31)
        uint8 month = (uint8(dateBytes[5]) - 48) * 10 + (uint8(dateBytes[6]) - 48);
        uint8 day = (uint8(dateBytes[8]) - 48) * 10 + (uint8(dateBytes[9]) - 48);
        
        if (month < 1 || month > 12) {
            revert InvalidDateString(date);
        }
        
        // Basic day validation (1-31, doesn't account for different month lengths)
        if (day < 1 || day > 31) {
            revert InvalidDateString(date);
        }
        
        _;
    }
    
    /// @dev Validates farmer status
    modifier onlyVerifiedFarmer(address farmer) {
        uint256 farmerId = farmerIdsByWallet[farmer];
        require(farmerId != 0, "Farmer not registered");
        if (!farmers[farmerId].verified) {
            revert InvalidFarmerStatus(true, false);
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
    /**
     * @notice Register a new farmer
     * @param name The name of the farmer (2-100 chars)
     * @param location The location of the farmer (3-200 chars)
     */
    function registerFarmer(
        string memory name, 
        string memory location
    ) 
        external 
        nonReentrant
        notZeroAddress(msg.sender)  // Prevent zero-address registration
        validStringLength(name, MIN_NAME_LENGTH, MAX_NAME_LENGTH, "name")
        validStringLength(location, MIN_LOCATION_LENGTH, MAX_LOCATION_LENGTH, "location")
    {
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
    /**
     * @dev Internal function to create a new produce record
     */
    function _createProduce(
        uint256 _farmerId,
        string memory _cropType,
        string memory _harvestDate
    ) internal returns (uint256) {
        _produceIds++;
        uint256 newProduceId = _produceIds;
        
        produce[newProduceId] = Produce({
            id: newProduceId,
            farmerId: _farmerId,
            cropType: _cropType,
            harvestDate: _harvestDate,
            certified: false
        });
        
        return newProduceId;
    }
    
    /**
     * @notice Record a new produce item
     * @param cropType The type of crop (2-50 chars)
     * @param harvestDate The harvest date in YYYY-MM-DD format
     * @return The ID of the newly recorded produce
     */
    function recordProduce(
        string memory cropType, 
        string memory harvestDate
    ) 
        external 
        notZeroAddress(msg.sender)
        nonReentrant
        onlyVerifiedFarmer(msg.sender)
        validStringLength(cropType, MIN_CROP_TYPE_LENGTH, MAX_CROP_TYPE_LENGTH, "cropType")
        validDateString(harvestDate)
        returns (uint256)
    {
        uint256 farmerId = farmerIdsByWallet[msg.sender];
        uint256 newProduceId = _createProduce(farmerId, cropType, harvestDate);
        
        emit ProduceRecorded(newProduceId, farmerId, cropType);
        return newProduceId;
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
