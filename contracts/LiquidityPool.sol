pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract LiquidityPool {
    ERC20 public token;
    
    uint256 public tokenBalance;
    uint256 public cryptoBalance;
    
    constructor(ERC20 _token) public {
        token = _token;
    }
    
    function deposit(uint256 tokenAmount) public payable {
        token.transferFrom(msg.sender, address(this), tokenAmount);
        
        tokenBalance += tokenAmount;
        cryptoBalance += msg.value;
    }
}

