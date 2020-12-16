const TokenLiquidityPool = artifacts.require('TokenLiquidityPool');
const BasicToken = artifacts.require('BasicToken');

contract('TokenLiquidityPool', function (accounts) {   
    const alice = accounts[0];
    const bob = accounts[1];
    const charlie = accounts[2];
    
    const MANTISSA = 1e18;
    
    let token1;
    let token2;
    let tokenLiquidityPool;
    
    beforeEach(async function () {
        token1 = await BasicToken.new('Token 1', 'TOK1');
        token2 = await BasicToken.new('Token 2', 'TOK2');

        await token1.transfer(alice, 1000000);
        await token2.transfer(alice, 1000000);
        
        tokenLiquidityPool = await TokenLiquidityPool.new(token1.address, token2.address);
    });
    
    it('creation', async function() {
        assert.equal(await tokenLiquidityPool.token1(), token1.address);
        assert.equal(await tokenLiquidityPool.token2(), token2.address);
    });
    
    it('first deposit', async function() {        
        const initialAliceToken1Balance = Number(await token1.balanceOf(alice));
        const initialPoolToken1Balance = Number(await token1.balanceOf(tokenLiquidityPool.address));
        const initialAliceToken2Balance = Number(await token2.balanceOf(alice));
        const initialPoolToken2Balance = Number(await token2.balanceOf(tokenLiquidityPool.address));
        
        await token1.approve(tokenLiquidityPool.address, 1000, { from: alice});
        await token2.approve(tokenLiquidityPool.address, 500, { from: alice});

        await tokenLiquidityPool.deposit(1000, 500);

        const finalAliceToken1Balance = Number(await token1.balanceOf(alice));
        const finalPoolToken1Balance = Number(await token1.balanceOf(tokenLiquidityPool.address));
        const finalAliceToken2Balance = Number(await token2.balanceOf(alice));
        const finalPoolToken2Balance = Number(await token2.balanceOf(tokenLiquidityPool.address));
        
        assert.equal(finalAliceToken1Balance, initialAliceToken1Balance - 1000);
        assert.equal(finalAliceToken2Balance, initialAliceToken2Balance - 500);
        assert.equal(finalPoolToken1Balance, initialPoolToken1Balance + 1000);
        assert.equal(finalPoolToken2Balance, initialPoolToken2Balance + 500);
        
        assert.equal(Number(await tokenLiquidityPool.token1Balance()), 1000);
        assert.equal(Number(await tokenLiquidityPool.token2Balance()), 500);
    });
    
    it('get token 1 price in token 2 units after first deposit', async function() {        
        await token1.approve(tokenLiquidityPool.address, 1000, { from: alice});
        await token2.approve(tokenLiquidityPool.address, 500, { from: alice});

        await tokenLiquidityPool.deposit(1000, 500);
        
        const token1Price = Number(await tokenLiquidityPool.getToken1Price());
        
        assert.equal(token1Price, MANTISSA / 2);
    });
});

