// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/AgroSafe.sol";

/**
 * @title ReentrancyAttack
 * @dev A malicious contract to test reentrancy protection
 */
contract ReentrancyAttack {
    AgroSafe public agroSafe;
    address public owner;
    bool public isAttacking;

    constructor(address _agroSafe) {
        agroSafe = AgroSafe(_agroSafe);
        owner = msg.sender;
    }

    // Fallback function used for reentrancy attack
    fallback() external payable {
        if (isAttacking) {
            // Try to re-enter the recordProduce function
            agroSafe.recordProduce("Hacked Crop", "2023-12-01");
        }
    }

    // Function to start the attack
    function attack() external {
        require(msg.sender == owner, "Only owner can attack");
        isAttacking = true;
        
        // This will trigger the fallback function during the external call
        agroSafe.recordProduce("Initial Crop", "2023-12-01");
        
        // Reset the attack flag
        isAttacking = false;
    }
}
