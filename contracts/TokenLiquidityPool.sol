pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TokenLiquidityPool {
    ERC20 public token1;
    ERC20 public token2;
    
    constructor(ERC20 _token1, ERC20 _token2) public {
        token1 = _token1;
        token2 = _token2;
    }    
}


