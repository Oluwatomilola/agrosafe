// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AgroSafe
 * @dev Registry and verification contract for farmers and produce with pagination support.
 * @notice This contract enables transparent tracking and verification of agricultural products
 * from farm to consumer, ensuring food safety and traceability.
 * 
 * Key Features:
 * - Farmer registration and verification system
 * - Produce recording with harvest date tracking
 * - Product certification by authorized administrators
 * - Pagination support for efficient data retrieval
 * - Emergency pause functionality for security
 * 
 * Security Features:
 * - Reentrancy protection on state-changing functions
 * - Input validation and sanitization
 * - Access control through OpenZeppelin's Ownable
 * - Emergency pause mechanism
 * 
 * @author AgroSafe Development Team
 * @version 1.0.0
 */
contract AgroSafe is Ownable, ReentrancyGuard, Pausable {
    /// @dev Maximum number of items that can be retrieved in a single paginated call
    /// @notice This limit prevents gas limit issues when retrieving large datasets
    uint256 public constant MAX_ITEMS_PER_PAGE = 100;
    
    /// @dev Constants for input validation
    /// @notice Minimum length for farmer/produce names (2 characters)
    uint256 public constant MIN_NAME_LENGTH = 2;
    /// @dev Maximum length for farmer/produce names (100 characters)
    uint256 public constant MAX_NAME_LENGTH = 100;
    /// @dev Minimum length for location strings (3 characters)
    uint256 public constant MIN_LOCATION_LENGTH = 3;
    /// @dev Maximum length for location strings (200 characters)
    uint256 public constant MAX_LOCATION_LENGTH = 200;
    /// @dev Minimum length for crop type strings (2 characters)
    uint256 public constant MIN_CROP_TYPE_LENGTH = 2;
    /// @dev Maximum length for crop type strings (50 characters)
    uint256 public constant MAX_CROP_TYPE_LENGTH = 50;
    /// @dev Length of valid date strings in YYYY-MM-DD format
    uint256 public constant MIN_DATE_LENGTH = 10;
    /// @dev Maximum length for date strings
    uint256 public constant MAX_DATE_LENGTH = 10;

    /// @custom:error ZeroAddressNotAllowed Reverts when a zero address is provided where a valid address is required
    /// @param invalidAddress The zero address that was provided
    error ZeroAddressNotAllowed(address invalidAddress);
    
    /// @custom:error StringTooShort Reverts when a string is shorter than the minimum required length
    /// @param field The name of the field that failed validation
    /// @param minLength The minimum required length
    /// @param actualLength The actual length of the provided string
    error StringTooShort(string field, uint256 minLength, uint256 actualLength);
    
    /// @custom:error StringTooLong Reverts when a string exceeds the maximum allowed length
    /// @param field The name of the field that exceeded the limit
    /// @param maxLength The maximum allowed length
    /// @param actualLength The actual length of the provided string
    error StringTooLong(string field, uint256 maxLength, uint256 actualLength);
    
    /// @custom:error InvalidDateString Reverts when a date string doesn't match YYYY-MM-DD format
    /// @param date The invalid date string that was provided
    error InvalidDateString(string date);
    
    /// @custom:error InvalidFarmerStatus Reverts when a farmer doesn't have the required verification status
    /// @param requiredStatus The status that was required
    /// @param actualStatus The actual status of the farmer
    error InvalidFarmerStatus(bool requiredStatus, bool actualStatus);

    /// @dev Modifier to check for zero address
    /// @param addr The address to validate
    /// @notice Reverts with ZeroAddressNotAllowed error if address is zero
    modifier notZeroAddress(address addr) {
        if (addr == address(0)) {
            revert ZeroAddressNotAllowed(addr);
        }
        _;
    }

    /// @dev Validates that a string's length is within the specified bounds
    /// @param str The string to validate
    /// @param minLen The minimum allowed length
    /// @param maxLen The maximum allowed length
    /// @param field The name of the field being validated
    /// @notice Reverts with StringTooShort or StringTooLong error if validation fails
    modifier validStringLength(
        string memory str,
        uint256 minLen,
        uint256 maxLen,
        string memory field
    ) {
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
    /// @param date The date string to validate
    /// @notice Reverts with InvalidDateString error if format is invalid
    /// @dev Performs comprehensive date validation including format and basic range checks
    modifier validDateString(string memory date) {
        bytes memory dateBytes = bytes(date);

        // Check length
        if (dateBytes.length != 10) {
            revert InvalidDateString(date);
        }

        // Check separators
        if (dateBytes[4] != "-" || dateBytes[7] != "-") {
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
        uint8 month = (uint8(dateBytes[5]) - 48) *
            10 +
            (uint8(dateBytes[6]) - 48);
        uint8 day = (uint8(dateBytes[8]) - 48) *
            10 +
            (uint8(dateBytes[9]) - 48);

        if (month < 1 || month > 12) {
            revert InvalidDateString(date);
        }

        // Basic day validation (1-31, doesn't account for different month lengths)
        if (day < 1 || day > 31) {
            revert InvalidDateString(date);
        }

        _;
    }

    /// @dev Validates that the caller is a verified farmer
    /// @param farmer The address of the farmer to check
    /// @notice Reverts if farmer is not registered or verified
    modifier onlyVerifiedFarmer(address farmer) {
        uint256 farmerId = farmerIdsByWallet[farmer];
        require(farmerId != 0, "Farmer not registered");
        if (!farmers[farmerId].verified) {
            revert InvalidFarmerStatus(true, false);
        }
        _;
    }
    
    /// @dev Auto-incrementing counter for farmer IDs
    /// @notice Starts at 0, first farmer gets ID 1
    uint256 private _farmerIds;
    /// @dev Auto-incrementing counter for produce IDs
    /// @notice Starts at 0, first produce gets ID 1
    uint256 private _produceIds;

    /// @dev Represents a registered farmer in the system
    /// @notice Contains farmer identification and verification information
    struct Farmer {
        /// @dev Unique identifier for the farmer (auto-incremented)
        uint256 id;
        /// @dev Full name of the farmer (2-100 characters)
        string name;
        /// @dev Ethereum wallet address of the farmer
        address wallet;
        /// @dev Physical location or address of the farmer (3-200 characters)
        string location;
        /// @dev Verification status - true if farmer has been verified by admin
        bool verified;
    }

    /// @dev Represents a produce item recorded in the system
    /// @notice Contains produce information linked to a verified farmer
    struct Produce {
        /// @dev Unique identifier for the produce item (auto-incremented)
        uint256 id;
        /// @dev ID of the farmer who produced this item
        uint256 farmerId;
        /// @dev Type of crop produced (e.g., "Corn", "Wheat", 2-50 characters)
        string cropType;
        /// @dev Harvest date in YYYY-MM-DD format
        string harvestDate;
        /// @dev Certification status - true if produce has been certified by admin
        bool certified;
    }

    /// @dev Mapping from farmer ID to Farmer struct
    /// @notice Stores all registered farmers by their unique ID
    mapping(uint256 => Farmer) public farmers;
    
    /// @dev Mapping from wallet address to farmer ID
    /// @notice Allows quick lookup of farmer ID by wallet address
    mapping(address => uint256) public farmerIdsByWallet;
    
    /// @dev Mapping from produce ID to Produce struct
    /// @notice Stores all recorded produce items by their unique ID
    mapping(uint256 => Produce) public produce;

    /// @dev Event emitted when a new farmer registers
    /// @param id Unique identifier of the registered farmer
    /// @param name Name of the registered farmer
    /// @param wallet Wallet address of the registered farmer
    event FarmerRegistered(uint256 indexed id, string name, address wallet);
    
    /// @dev Event emitted when a farmer's verification status changes
    /// @param id Unique identifier of the farmer
    /// @param status New verification status (true = verified, false = unverified)
    event FarmerVerified(uint256 indexed id, bool status);
    
    /// @dev Event emitted when new produce is recorded
    /// @param id Unique identifier of the recorded produce
    /// @param farmerId ID of the farmer who produced the item
    /// @param cropType Type of crop that was recorded
    event ProduceRecorded(
        uint256 indexed id,
        uint256 farmerId,
        string cropType
    );
    
    /// @dev Event emitted when a produce item's certification status changes
    /// @param id Unique identifier of the produce item
    /// @param certified New certification status (true = certified, false = not certified)
    event ProduceCertified(uint256 indexed id, bool certified);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     * @param initialOwner The address to set as the initial owner of the contract.
     * @notice The owner has special privileges to verify farmers and certify produce
     */
    constructor(
        address initialOwner
    ) Ownable(initialOwner) notZeroAddress(initialOwner) {}

    /**
     * @notice Pause the contract (only owner)
     * @dev Prevents all state-changing operations when paused
     * @dev Uses OpenZeppelin's Pausable pattern for emergency stops
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract (only owner)
     * @dev Resumes normal contract operations
     * @dev Can only be called by the contract owner
     */
    function unpause() external onlyOwner {
        _unpause();
    }

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
    ) external {
    )
        external
        whenNotPaused
        nonReentrant
        notZeroAddress(msg.sender) // Prevent zero-address registration
        validStringLength(name, MIN_NAME_LENGTH, MAX_NAME_LENGTH, "name")
        validStringLength(
            location,
            MIN_LOCATION_LENGTH,
            MAX_LOCATION_LENGTH,
            "location"
        )
    {
        require(
            farmerIdsByWallet[msg.sender] == 0,
            "Farmer already registered"
        );
        require(
            bytes(name).length > 0 && bytes(name).length <= 100,
            "Name must be 1-100 characters"
        );
        require(
            bytes(location).length > 0 && bytes(location).length <= 200,
            "Location must be 1-200 characters"
        );

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
     * @dev Sets the verification status of a registered farmer
     * @param farmerId The unique ID of the farmer to verify
     * @param status The verification status to set (true = verified, false = unverified)
     * @dev Emits FarmerVerified event upon status change
     * @dev Only callable by contract owner
     */
    function verifyFarmer(
        uint256 farmerId,
        bool status
    ) external onlyOwner whenNotPaused nonReentrant {
        require(farmerId != 0, "Invalid farmer ID");
        require(farmers[farmerId].id != 0, "Farmer not found");

        address farmerAddress = farmers[farmerId].wallet;
        require(farmerAddress != address(0), "Invalid farmer address");

        farmers[farmerId].verified = status;
        emit FarmerVerified(farmerId, status);
    }

    /**
     * @dev Internal function to create a new produce record
     * @param _farmerId The ID of the farmer who produced the item
     * @param _cropType The type of crop being recorded
     * @param _harvestDate The harvest date in YYYY-MM-DD format
     * @return newProduceId The unique ID of the newly created produce record
     * @dev This function is internal and called by public functions
     */
    function recordProduce(
        string memory cropType,
        string memory harvestDate
    ) external {
        uint256 farmerId = farmerIdsByWallet[msg.sender];
        require(farmerId != 0, "Farmer not registered");
        require(farmers[farmerId].verified, "Farmer not verified");
        require(
            bytes(cropType).length > 0 && bytes(cropType).length <= 100,
            "Crop type must be 1-100 characters"
        );
        require(
            bytes(harvestDate).length == 10,
            "Harvest date must be in YYYY-MM-DD format"
        );

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
    )
        external
        whenNotPaused
        notZeroAddress(msg.sender)
        nonReentrant
        onlyVerifiedFarmer(msg.sender)
        validStringLength(
            cropType,
            MIN_CROP_TYPE_LENGTH,
            MAX_CROP_TYPE_LENGTH,
            "cropType"
        )
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
     * @dev Sets the certification status of a produce item
     * @param produceId The unique ID of the produce to certify
     * @param certified The certification status to set (true = certified, false = not certified)
     * @dev Emits ProduceCertified event upon status change
     * @dev Only callable by contract owner
     */
    function certifyProduce(
        uint256 produceId,
        bool certified
    ) external onlyOwner whenNotPaused nonReentrant {
        require(produceId != 0, "Invalid produce ID");
        require(produce[produceId].id != 0, "Produce not found");
        produce[produceId].certified = certified;
        emit ProduceCertified(produceId, certified);
    }

    /**
     * @notice Get total number of registered farmers
     * @return Total count of farmers registered in the system
     * @dev Useful for pagination and system statistics
     */
    function totalFarmers() external view returns (uint256) {
        return _farmerIds;
    }

    /**
     * @notice Get total number of recorded produce items
     * @return Total count of produce items recorded in the system
     * @dev Useful for pagination and system statistics
     */
    function totalProduce() external view returns (uint256) {
        return _produceIds;
    }

    /**
     * @notice Check if an address is a registered farmer
     */
    function isFarmerRegistered(address wallet) external view returns (bool) {
        return farmerIdsByWallet[wallet] != 0;
    }

    /**
     * @notice Get total certified produce count
     */
    function totalCertifiedProduce() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _produceIds; i++) {
            if (produce[i].certified) {
                count++;
            }
        }
        return count;
    }

    /**
     * @notice Get farmer info by wallet address
     */
    function getFarmerByWallet(
        address wallet
    ) external view returns (Farmer memory) {
        uint256 farmerId = farmerIdsByWallet[wallet];
        require(farmerId != 0, "Farmer not registered");
        return farmers[farmerId];
    }
}
