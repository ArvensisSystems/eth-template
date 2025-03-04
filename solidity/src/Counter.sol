// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {SafeTransferLib} from "solady/src/utils/SafeTransferLib.sol";
import {Ownable} from "solady/src/auth/Ownable.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract Counter is Ownable {
    using SafeTransferLib for address;
    uint256 public number;
    address public token;

    constructor(address _token) {
        token = _token;
        _initializeOwner(msg.sender);
    }

    function setNumber(uint256 newNumber) public {
        token.safeTransferFrom(msg.sender, address(this), 0.01 ether);
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    function withdraw(uint256 value) public {
        IERC20(token).transfer(msg.sender, value);
    }
}
