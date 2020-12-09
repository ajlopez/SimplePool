const TokenLiquidityPool = artifacts.require('TokenLiquidityPool');
const BasicToken = artifacts.require('BasicToken');

contract('TokenLiquidityPool', function (accounts) {   
    it('creation', async function() {
        const token1 = await BasicToken.new('Token 1', 'TOK1');
        const token2 = await BasicToken.new('Token 2', 'TOK2');
        
        const tokenLiquidityPool = await TokenLiquidityPool.new(token1.address, token2.address);

        assert.equal(await tokenLiquidityPool.token1(), token1.address);
        assert.equal(await tokenLiquidityPool.token2(), token2.address);
    });
});

