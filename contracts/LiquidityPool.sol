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
    
    function buyTokens() public payable {
        uint256 amount = msg.value;
        
        uint256 tokenAmount = tokenBalance -
            tokenBalance * cryptoBalance 
            / (cryptoBalance + amount);
            
        tokenBalance -= tokenAmount;
        cryptoBalance += amount;
        
        token.transfer(msg.sender, tokenAmount);
    }
}

