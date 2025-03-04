// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";
import {WETH} from "solady/src/tokens/WETH.sol";

contract CounterTest is Test {
    Counter public counter;
    WETH public weth;

    function setUp() public {
        vm.deal(address(this), 1000 ether);
        weth = new WETH();
        counter = new Counter(address(weth));
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        vm.deal(address(this), 1 ether);
        weth.deposit{value: 1 ether}();
        weth.approve(address(counter), 1 ether);

        uint256 prevBalance = weth.balanceOf(address(this));

        counter.setNumber(x);
        assertEq(counter.number(), x);
        assertEq(weth.balanceOf(address(this)), prevBalance - 0.01 ether);
    }
}
