// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgroSafe
 * @dev Simple registry and verification contract for farmers and produce.
 * Uses native uint counters instead of Counters.sol.
 */
contract AgroSafe is Ownable, ReentrancyGuard {
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
     * @notice Get total counts
     */
    function totalFarmers() external view returns (uint256) {
        return _farmerIds;
    }

    function totalProduce() external view returns (uint256) {
        return _produceIds;
    }
}
