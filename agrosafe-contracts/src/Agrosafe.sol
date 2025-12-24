// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgroSafe
 * @dev Simple registry and verification contract for farmers and produce.
 * Uses native uint counters instead of Counters.sol.
 */
contract AgroSafe is Ownable {
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
    event ProduceRecorded(
        uint256 indexed id,
        uint256 farmerId,
        string cropType
    );
    event ProduceCertified(uint256 indexed id, bool certified);

    /**
     * @dev Passes msg.sender as the initial owner to the Ownable constructor.
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Register a new farmer
     */
    function registerFarmer(
        string memory name,
        string memory location
    ) external {
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
     */
    function verifyFarmer(uint256 farmerId, bool status) external onlyOwner {
        require(farmers[farmerId].id != 0, "Farmer not found");
        farmers[farmerId].verified = status;
        emit FarmerVerified(farmerId, status);
    }

    /**
     * @notice Record a produce linked to a farmer
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
     */
    function certifyProduce(
        uint256 produceId,
        bool certified
    ) external onlyOwner {
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
