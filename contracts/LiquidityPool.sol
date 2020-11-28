pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract LiquidityPool {
    ERC20 public token;
    
    uint256 public tokenBalance;
    uint256 public cryptoBalance;
    
    uint256 constant public MANTISSA = 1e18;
    
    event Deposit(address user, uint256 value, uint256 tokenAmount);
    
    constructor(ERC20 _token) public {
        token = _token;
    }
    
    function deposit(uint256 tokenAmount) public payable {
        require(token.transferFrom(msg.sender, address(this), tokenAmount));

        if (tokenBalance == 0 && cryptoBalance == 0) {
            tokenBalance = tokenAmount;
            cryptoBalance = msg.value;
            
            emit Deposit(msg.sender, msg.value, tokenAmount);
            
            return;
        }
        
        uint256 tokenDepositAmount = tokenBalance * MANTISSA 
            / cryptoBalance 
            * msg.value
            / MANTISSA;
            
        require(tokenDepositAmount <= tokenAmount);
            
        tokenBalance += tokenDepositAmount;
        cryptoBalance += msg.value;

        emit Deposit(msg.sender, msg.value, tokenDepositAmount);
        
        if (tokenDepositAmount < tokenAmount)
            token.transfer(msg.sender, tokenAmount - tokenDepositAmount);
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
    
    function sellTokens(uint256 tokenAmount) public {
        // TODO require
        token.transferFrom(msg.sender, address(this), tokenAmount);
        
        uint256 amount = cryptoBalance -
            tokenBalance * cryptoBalance 
            / (tokenBalance + tokenAmount);
            
        tokenBalance += tokenAmount;
        cryptoBalance -= amount;
        
        msg.sender.transfer(amount);
    }
}

