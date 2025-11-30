// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgroSafe.sol";

contract AgroSafeTest is Test {
    AgroSafe public agroSafe;
    address public owner = address(0x1);
    address public farmer = address(0x2);
    address public verifier = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        agroSafe = new AgroSafe();
        vm.stopPrank();
    }

    function test_initial_state() public {
        assertEq(agroSafe.owner(), owner);
        assertEq(agroSafe.totalFarmers(), 0);
        assertEq(agroSafe.totalProduce(), 0);
    }

    function test_register_farmer() public {
        string memory name = "Test Farmer";
        string memory location = "Test Location";
        
        vm.prank(farmer);
        agroSafe.registerFarmer(name, location);

        (uint256 id, string memory farmerName, address wallet, string memory farmerLocation, bool verified) = 
            agroSafe.farmers(1);
            
        assertEq(id, 1);
        assertEq(farmerName, name);
        assertEq(wallet, farmer);
        assertEq(farmerLocation, location);
        assertEq(verified, false);
        assertEq(agroSafe.totalFarmers(), 1);
    }

    function test_record_produce() public {
        // First register and verify a farmer
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");
        
        // Verify the farmer (only owner can do this)
        vm.prank(owner);
        agroSafe.verifyFarmer(1, true);

        // Record produce
        string memory cropType = "Wheat";
        string memory harvestDate = "2023-11-29";
        
        vm.prank(farmer);
        agroSafe.recordProduce(cropType, harvestDate);

        (uint256 id, uint256 farmerId, string memory produceCropType, string memory produceHarvestDate, bool certified) = 
            agroSafe.produce(1);
            
        assertEq(id, 1);
        assertEq(farmerId, 1);
        assertEq(produceCropType, cropType);
        assertEq(produceHarvestDate, harvestDate);
        assertEq(certified, false);
        assertEq(agroSafe.totalProduce(), 1);
    }

    function test_only_owner_can_verify_farmer() public {
        // Register a farmer first
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");

        // Non-owner should not be able to verify
        vm.prank(verifier);
        vm.expectRevert();
        agroSafe.verifyFarmer(1, true); // Will revert with OwnableUnauthorizedAccount

        // Owner should be able to verify
        vm.prank(owner);
        agroSafe.verifyFarmer(1, true);

        (,,,, bool verified) = agroSafe.farmers(1);
        assertTrue(verified);
    }

    function test_only_owner_can_certify_produce() public {
        // Setup test data
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");
        
        // Verify the farmer first
        vm.prank(owner);
        agroSafe.verifyFarmer(1, true);
        
        // Record produce
        vm.prank(farmer);
        agroSafe.recordProduce("Wheat", "2023-11-29");

        // Non-owner should not be able to certify
        vm.prank(verifier);
        vm.expectRevert();
        agroSafe.certifyProduce(1, true); // Will revert with OwnableUnauthorizedAccount

        // Owner should be able to certify
        vm.prank(owner);
        agroSafe.certifyProduce(1, true);

        (,,,, bool certified) = agroSafe.produce(1);
        assertTrue(certified);
    }
    
    function test_cannot_record_produce_unverified_farmer() public {
        // Register but don't verify the farmer
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");
        
        // Try to record produce - should fail
        vm.prank(farmer);
        vm.expectRevert("Farmer not verified");
        agroSafe.recordProduce("Wheat", "2023-11-29");
    }
    
    function test_cannot_register_farmer_twice() public {
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");
        
        // Try to register again with same wallet
        vm.prank(farmer);
        vm.expectRevert("Farmer already registered");
        agroSafe.registerFarmer("Test Farmer 2", "Different Location");
    }
}
