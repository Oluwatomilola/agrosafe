// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgroSafe.sol";

contract DeployAgroSafe is Script {
    function run() external {
        // Load your private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Begin broadcast — transactions after this are signed & sent
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        AgroSafe agro = new AgroSafe();

        console.log("AgroSafe deployed at:", address(agro));

        vm.stopBroadcast();
    }
}
