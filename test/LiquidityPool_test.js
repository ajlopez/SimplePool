
const LiquidityPool = artifacts.require('LiquidityPool');

contract('LiquidityPool', function (accounts) {   
    it('create contract', async function () {
        const liquidityPool = await LiquidityPool.new(accounts[0]);
        
        const token = await liquidityPool.token();
        const tokenBalance = Number(await liquidityPool.tokenBalance());
        const cryptoBalance = Number(await liquidityPool.cryptoBalance());
        
        assert.equal(token, accounts[0]);
        assert.equal(tokenBalance, 0);
        assert.equal(cryptoBalance, 0);
    });
});

