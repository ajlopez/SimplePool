pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TokenLiquidityPool {
    ERC20 public token1;
    ERC20 public token2;

    uint256 public token1Balance;
    uint256 public token2Balance;
    
    uint256 constant public MANTISSA = 1e18;

    constructor(ERC20 _token1, ERC20 _token2) public {
        token1 = _token1;
        token2 = _token2;
    }
    
    function deposit(uint256 token1Amount, uint256 token2Amount) public payable {
        require(token1.transferFrom(msg.sender, address(this), token1Amount));
        require(token2.transferFrom(msg.sender, address(this), token2Amount));
        
        token1Balance += token1Amount;
        token2Balance += token2Amount;
    }
    
    function getToken1Price() public view returns (uint256) {
        return token2Balance * MANTISSA / token1Balance;
    }
    
    function getToken2Price() public view returns (uint256) {
        return token1Balance * MANTISSA / token2Balance;
    }
}


