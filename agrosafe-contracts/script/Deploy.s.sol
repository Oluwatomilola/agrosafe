// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {AgroSafe} from "../src/AgroSafe.sol";

contract DeployAgroSafe is Script {
    function run() external {
        // Get the deployer's private key from the environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract
        AgroSafe agroSafe = new AgroSafe();
        
        // Log the deployed contract address
        console.log("AgroSafe deployed to:", address(agroSafe));
        
        // Stop broadcasting
        vm.stopBroadcast();
    }
}
