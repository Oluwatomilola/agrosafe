// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "../../lib/forge-std/src/Script.sol";
import {console} from "../../lib/forge-std/src/console.sol";
import {AgroSafe} from "../src/AgroSafe.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        AgroSafe agroSafe = new AgroSafe();

        vm.stopBroadcast();

        // Log the deployed address
        console.log("AgroSafe deployed at:", address(agroSafe));
    }
}