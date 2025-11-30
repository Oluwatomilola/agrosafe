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
        agroSafe = new AgroSafe(owner);
        vm.stopPrank();
    }
    
    function test_constructor_revertsOnZeroAddress() public {
        vm.expectRevert(abi.encodeWithSignature("ZeroAddressNotAllowed(address)", address(0)));
        new AgroSafe(address(0));
    }
    
    function test_registerFarmer_revertsOnZeroAddress() public {
        // This is implicitly tested by the notZeroAddress modifier on recordProduce
        // which is called by a farmer after registration
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");
        
        // Verify the farmer was registered
        (uint256 id, string memory name, address farmerAddr, string memory location, bool verified) = 
            agroSafe.farmers(1);
        assertEq(id, 1);
        assertEq(name, "Test Farmer");
        assertEq(farmerAddr, farmer);
        assertEq(location, "Test Location");
        assertEq(verified, false);
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
        assertEq(farmerLocation, location);
        assertEq(verified, false);
        assertEq(agroSafe.totalFarmers(), 1);
    }

    function test_recordProduce() public {
        // First register and verify a farmer
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");
        
        vm.prank(owner);
        agroSafe.verifyFarmer(1, true);
        
        // Record produce
        vm.prank(farmer);
        agroSafe.recordProduce("Wheat", "2023-11-30");
        
        // Check the produce was recorded
        (uint256 id, uint256 farmerId, string memory cropType, string memory harvestDate, bool certified) = 
            agroSafe.produce(1);
            
        assertEq(id, 1);
        assertEq(farmerId, 1);
        assertEq(cropType, "Wheat");
        assertEq(harvestDate, "2023-11-30");
        assertEq(certified, false);
        assertEq(agroSafe.totalProduce(), 1);
        
        // Test recording produce with unverified farmer
        address anotherFarmer = address(0x4);
        vm.prank(anotherFarmer);
        agroSafe.registerFarmer("Another Farmer", "Another Location");
        
        vm.prank(anotherFarmer);
        vm.expectRevert("Farmer not verified");
        agroSafe.recordProduce("Corn", "2023-11-30");
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

    function test_verifyFarmer() public {
        // First register a farmer
        vm.prank(farmer);
        agroSafe.registerFarmer("Test Farmer", "Test Location");
        
        // Test verification with invalid farmer ID
        vm.prank(owner);
        vm.expectRevert("Invalid farmer ID");
        agroSafe.verifyFarmer(0, true);
        
        // Test verification with non-existent farmer
        vm.prank(owner);
        vm.expectRevert("Farmer not found");
        agroSafe.verifyFarmer(999, true);
        
        // Verify the farmer
        vm.prank(owner);
        agroSafe.verifyFarmer(1, true);
        
        // Check the verification status
        (,,,, bool verified) = agroSafe.farmers(1);
        assertTrue(verified);
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
