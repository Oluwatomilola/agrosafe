// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgroSafe.sol";

contract InputValidationTest is Test {
    AgroSafe public agroSafe;
    address public owner = address(0x1);
    address public farmer = address(0x2);
    
    // Test data
    string public constant VALID_NAME = "John Doe";
    string public constant VALID_LOCATION = "123 Farm St, Countryside";
    string public constant VALID_CROP = "Wheat";
    string public constant VALID_DATE = "2023-12-01";
    
    function setUp() public {
        vm.startPrank(owner);
        agroSafe = new AgroSafe(owner);
        
        // Register and verify a farmer for testing
        vm.stopPrank();
        vm.prank(farmer);
        agroSafe.registerFarmer(VALID_NAME, VALID_LOCATION);
        
        vm.prank(owner);
        agroSafe.verifyFarmer(1, true);
    }
    
    // Test valid inputs
    function test_validInputs() public {
        // Test valid farmer registration
        address newFarmer = address(0x3);
        vm.prank(newFarmer);
        agroSafe.registerFarmer("Jane Doe", "456 Orchard Rd, Countryside");
        
        // Test valid produce recording
        vm.prank(farmer);
        agroSafe.recordProduce("Corn", "2023-12-15");
        
        // Verify the produce was recorded
        AgroSafe.Produce[] memory produce = agroSafe.getProducePaginated(0, 1);
        assertEq(produce[0].cropType, "Corn", "Produce should be recorded with correct crop type");
    }
    
    // Test string length validation
    function test_stringLengthValidation() public {
        // Test name too short
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.StringTooShort.selector, 
            "name", 
            agroSafe.MIN_NAME_LENGTH(), 
            1
        ));
        agroSafe.registerFarmer("A", VALID_LOCATION);
        
        // Test name too long
        string memory longName = new string(agroSafe.MAX_NAME_LENGTH() + 1);
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.StringTooLong.selector, 
            "name", 
            agroSafe.MAX_NAME_LENGTH(), 
            agroSafe.MAX_NAME_LENGTH() + 1
        ));
        agroSafe.registerFarmer(longName, VALID_LOCATION);
        
        // Test location too short
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.StringTooShort.selector, 
            "location", 
            agroSafe.MIN_LOCATION_LENGTH(), 
            2
        ));
        agroSafe.registerFarmer(VALID_NAME, "AB");
        
        // Test crop type too long
        string memory longCrop = new string(agroSafe.MAX_CROP_TYPE_LENGTH() + 1);
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.StringTooLong.selector, 
            "cropType", 
            agroSafe.MAX_CROP_TYPE_LENGTH(), 
            agroSafe.MAX_CROP_TYPE_LENGTH() + 1
        ));
        vm.prank(farmer);
        agroSafe.recordProduce(longCrop, VALID_DATE);
    }
    
    // Test date format validation
    function test_dateValidation() public {
        // Test date too short
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.InvalidDateString.selector, 
            "2023-12-1"
        ));
        vm.prank(farmer);
        agroSafe.recordProduce(VALID_CROP, "2023-12-1");
        
        // Test date too long
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.InvalidDateString.selector, 
            "2023-12-011"
        ));
        vm.prank(farmer);
        agroSafe.recordProduce(VALID_CROP, "2023-12-011");
        
        // Test invalid month
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.InvalidDateString.selector, 
            "2023-13-01"
        ));
        vm.prank(farmer);
        agroSafe.recordProduce(VALID_CROP, "2023-13-01");
        
        // Test invalid day
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.InvalidDateString.selector, 
            "2023-12-32"
        ));
        vm.prank(farmer);
        agroSafe.recordProduce(VALID_CROP, "2023-12-32");
        
        // Test invalid format (missing hyphen)
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.InvalidDateString.selector, 
            "20231201"
        ));
        vm.prank(farmer);
        agroSafe.recordProduce(VALID_CROP, "20231201");
    }
    
    // Test farmer verification status
    function test_farmerVerification() public {
        // Register an unverified farmer
        address unverifiedFarmer = address(0x4);
        vm.prank(unverifiedFarmer);
        agroSafe.registerFarmer("Unverified Farmer", "Some Location");
        
        // Try to record produce with unverified farmer
        vm.expectRevert(abi.encodeWithSelector(
            AgroSafe.InvalidFarmerStatus.selector, 
            true, 
            false
        ));
        vm.prank(unverifiedFarmer);
        agroSafe.recordProduce("Test Crop", "2023-12-01");
    }
    
    // Test zero address validation
    function test_zeroAddressValidation() public {
        // Try to deploy with zero address
        // Note: OpenZeppelin's Ownable throws OwnableInvalidOwner for zero address
        vm.expectRevert(abi.encodeWithSignature(
            "OwnableInvalidOwner(address)",
            address(0)
        ));
        new AgroSafe(address(0));
    }
}
