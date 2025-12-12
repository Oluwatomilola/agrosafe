// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgroSafe.sol";

contract PaginationTest is Test {
    AgroSafe public agroSafe;
    address public owner = address(0x1);
    address public farmer1 = address(0x2);
    address public farmer2 = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        agroSafe = new AgroSafe(owner);
        
        // Register and verify farmers
        vm.stopPrank();
        
        // Register farmer 1
        vm.prank(farmer1);
        agroSafe.registerFarmer("Farmer One", "Location 1");
        
        // Register farmer 2
        vm.prank(farmer2);
        agroSafe.registerFarmer("Farmer Two", "Location 2");
        
        // Verify both farmers
        vm.prank(owner);
        agroSafe.verifyFarmer(1, true);
        
        vm.prank(owner);
        agroSafe.verifyFarmer(2, true);
        
        // Add some produce for farmer 1 with valid dates (DD must be between 01-31)
        string[5] memory dates1 = ["2023-01-01", "2023-01-15", "2023-01-20", "2023-01-25", "2023-01-31"];
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(farmer1);
            agroSafe.recordProduce("Crop A", dates1[i]);
        }
        
        // Add some produce for farmer 2 with valid dates
        string[3] memory dates2 = ["2023-02-10", "2023-02-15", "2023-02-20"];
        for (uint256 i = 0; i < 3; i++) {
            vm.prank(farmer2);
            agroSafe.recordProduce("Crop B", dates2[i]);
        }
    }
    
    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    function test_getFarmersPaginated() public {
        // Get first page (2 farmers total)
        AgroSafe.Farmer[] memory farmers = agroSafe.getFarmersPaginated(0, 10);
        assertEq(farmers.length, 2, "Should return all farmers");
        assertEq(farmers[0].id, 1, "First farmer ID should be 1");
        assertEq(farmers[1].id, 2, "Second farmer ID should be 2");
        
        // Test pagination with limit
        farmers = agroSafe.getFarmersPaginated(0, 1);
        assertEq(farmers.length, 1, "Should return only 1 farmer");
        assertEq(farmers[0].id, 1, "Should return first farmer");
        
        // Test offset
        farmers = agroSafe.getFarmersPaginated(1, 10);
        assertEq(farmers.length, 1, "Should return 1 farmer with offset 1");
        assertEq(farmers[0].id, 2, "Should return second farmer");
    }
    
    function test_getProducePaginated() public {
        // Get all produce (8 total)
        AgroSafe.Produce[] memory produce = agroSafe.getProducePaginated(0, 10);
        assertEq(produce.length, 8, "Should return all produce items");
        
        // Test pagination
        produce = agroSafe.getProducePaginated(0, 3);
        assertEq(produce.length, 3, "Should return 3 items");
        
        // Test offset
        produce = agroSafe.getProducePaginated(3, 3);
        assertEq(produce.length, 3, "Should return 3 items with offset 3");
        
        // Test last page
        produce = agroSafe.getProducePaginated(6, 10);
        assertEq(produce.length, 2, "Should return remaining 2 items");
    }
    
    function test_getProduceByFarmerPaginated() public {
        // Get all produce for farmer 1 (5 items)
        AgroSafe.Produce[] memory produce = agroSafe.getProduceByFarmerPaginated(1, 0, 10);
        assertEq(produce.length, 5, "Should return all produce for farmer 1");
        
        // Get all produce for farmer 2 (3 items)
        produce = agroSafe.getProduceByFarmerPaginated(2, 0, 10);
        assertEq(produce.length, 3, "Should return all produce for farmer 2");
        
        // Test pagination for farmer 1
        produce = agroSafe.getProduceByFarmerPaginated(1, 0, 2);
        assertEq(produce.length, 2, "Should return 2 items for farmer 1");
        
        // Test offset for farmer 1
        produce = agroSafe.getProduceByFarmerPaginated(1, 2, 10);
        assertEq(produce.length, 3, "Should return remaining 3 items for farmer 1 with offset 2");
    }
    
    function test_getFarmersPaginated_invalidParams() public {
        // Test invalid limit (0)
        vm.expectRevert("Invalid limit");
        agroSafe.getFarmersPaginated(0, 0);
        
        // Test limit too large
        vm.expectRevert("Invalid limit");
        agroSafe.getFarmersPaginated(0, 101);
        
        // Test offset out of bounds
        vm.expectRevert("Offset out of bounds");
        agroSafe.getFarmersPaginated(10, 5);
    }
    
    function test_getProduceByFarmerPaginated_invalidParams() public {
        // Test invalid farmer ID
        vm.expectRevert("Invalid farmer ID");
        agroSafe.getProduceByFarmerPaginated(0, 0, 10);
        
        vm.expectRevert("Invalid farmer ID");
        agroSafe.getProduceByFarmerPaginated(999, 0, 10);
        
        // Test invalid limit
        vm.expectRevert("Invalid limit");
        agroSafe.getProduceByFarmerPaginated(1, 0, 0);
        
        vm.expectRevert("Invalid limit");
        agroSafe.getProduceByFarmerPaginated(1, 0, 101);
    }
}
