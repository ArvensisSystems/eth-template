// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";
import {DeployHelpers} from "./DeployHelpers.sol";
import {WETH} from "solady/src/tokens/WETH.sol";

contract DeployScript is DeployHelpers {
    function setUp() public {}

    // Pro tip: you can use block.chainid
    function run() public DeployerRunner {
        address weth;
        if (block.chainid == 1) {
            weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        } else if (block.chainid == 31337) {
            // Deploy a WETH mock
            weth = address(new WETH());
        }
        new Counter(weth);
    }
}
