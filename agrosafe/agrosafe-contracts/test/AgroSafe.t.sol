// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {AgroSafe} from "../src/AgroSafe.sol";

contract AgroSafeTest is Test {
    AgroSafe agroSafe;
    address owner = address(1);
    address farmer1 = address(2);
    address farmer2 = address(3);

    function setUp() public {
        vm.prank(owner);
        agroSafe = new AgroSafe();
    }

    function testRegisterFarmer() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        uint256 farmerId = agroSafe.farmerIdsByWallet(farmer1);
        assertEq(farmerId, 1);

        (uint256 id, string memory name, address wallet, string memory location, bool verified) = agroSafe.farmers(farmerId);
        assertEq(id, 1);
        assertEq(name, "John Doe");
        assertEq(wallet, farmer1);
        assertEq(location, "Farm Location");
        assertEq(verified, false);
    }

    function testCannotRegisterFarmerTwice() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        vm.expectRevert("Farmer already registered");
        vm.prank(farmer1);
        agroSafe.registerFarmer("Jane Doe", "Another Location");
    }

    function testVerifyFarmer() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        uint256 farmerId = agroSafe.farmerIdsByWallet(farmer1);

        vm.prank(owner);
        agroSafe.verifyFarmer(farmerId, true);

        (, , , , bool verified) = agroSafe.farmers(farmerId);
        assertEq(verified, true);
    }

    function testOnlyOwnerCanVerifyFarmer() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        uint256 farmerId = agroSafe.farmerIdsByWallet(farmer1);

        vm.prank(farmer2);
        vm.expectRevert();
        agroSafe.verifyFarmer(farmerId, true);
    }

    function testRecordProduce() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        uint256 farmerId = agroSafe.farmerIdsByWallet(farmer1);

        vm.prank(owner);
        agroSafe.verifyFarmer(farmerId, true);

        vm.prank(farmer1);
        agroSafe.recordProduce("Wheat", "2023-10-01");

        uint256 produceId = agroSafe.totalProduce();
        assertEq(produceId, 1);

        (uint256 id, uint256 pFarmerId, string memory cropType, string memory harvestDate, bool certified) = agroSafe.produce(produceId);
        assertEq(id, 1);
        assertEq(pFarmerId, farmerId);
        assertEq(cropType, "Wheat");
        assertEq(harvestDate, "2023-10-01");
        assertEq(certified, false);
    }

    function testCannotRecordProduceIfNotRegistered() public {
        vm.prank(farmer1);
        vm.expectRevert("Farmer not registered");
        agroSafe.recordProduce("Wheat", "2023-10-01");
    }

    function testCannotRecordProduceIfNotVerified() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        vm.prank(farmer1);
        vm.expectRevert("Farmer not verified");
        agroSafe.recordProduce("Wheat", "2023-10-01");
    }

    function testCertifyProduce() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        uint256 farmerId = agroSafe.farmerIdsByWallet(farmer1);

        vm.prank(owner);
        agroSafe.verifyFarmer(farmerId, true);

        vm.prank(farmer1);
        agroSafe.recordProduce("Wheat", "2023-10-01");

        uint256 produceId = agroSafe.totalProduce();

        vm.prank(owner);
        agroSafe.certifyProduce(produceId, true);

        (, , , , bool certified) = agroSafe.produce(produceId);
        assertEq(certified, true);
    }

    function testOnlyOwnerCanCertifyProduce() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        uint256 farmerId = agroSafe.farmerIdsByWallet(farmer1);

        vm.prank(owner);
        agroSafe.verifyFarmer(farmerId, true);

        vm.prank(farmer1);
        agroSafe.recordProduce("Wheat", "2023-10-01");

        uint256 produceId = agroSafe.totalProduce();

        vm.prank(farmer2);
        vm.expectRevert();
        agroSafe.certifyProduce(produceId, true);
    }

    function testTotalCounts() public {
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");

        vm.prank(farmer2);
        agroSafe.registerFarmer("Jane Doe", "Another Farm");

        assertEq(agroSafe.totalFarmers(), 2);

        uint256 farmerId1 = agroSafe.farmerIdsByWallet(farmer1);
        vm.prank(owner);
        agroSafe.verifyFarmer(farmerId1, true);

        vm.prank(farmer1);
        agroSafe.recordProduce("Wheat", "2023-10-01");

        vm.prank(farmer1);
        agroSafe.recordProduce("Corn", "2023-10-02");

        assertEq(agroSafe.totalProduce(), 2);
    }

    // Integration test: full flow
    function testFullIntegrationFlow() public {
        // Register farmer
        vm.prank(farmer1);
        agroSafe.registerFarmer("John Doe", "Farm Location");
        uint256 farmerId = agroSafe.farmerIdsByWallet(farmer1);

        // Verify farmer
        vm.prank(owner);
        agroSafe.verifyFarmer(farmerId, true);

        // Record produce
        vm.prank(farmer1);
        agroSafe.recordProduce("Organic Wheat", "2023-10-01");
        uint256 produceId = agroSafe.totalProduce();

        // Certify produce
        vm.prank(owner);
        agroSafe.certifyProduce(produceId, true);

        // Verify final state
        (, , , , bool verified) = agroSafe.farmers(farmerId);
        assertTrue(verified);

        (, , string memory cropType, , bool certified) = agroSafe.produce(produceId);
        assertEq(cropType, "Organic Wheat");
        assertTrue(certified);

        assertEq(agroSafe.totalFarmers(), 1);
        assertEq(agroSafe.totalProduce(), 1);
    }
}