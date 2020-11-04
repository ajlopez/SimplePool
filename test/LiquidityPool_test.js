
const LiquidityPool = artifacts.require('LiquidityPool');

contract('LiquidityPool', function (accounts) {   
    let liquidityPool;
    
    const root = accounts[0];
    const token = accounts[1];
    
    beforeEach(async function () {
        liquidityPool = await LiquidityPool.new(token);
    });
    
    it('create contract', async function () {
        const token = await liquidityPool.token();
        const tokenBalance = Number(await liquidityPool.tokenBalance());
        const cryptoBalance = Number(await liquidityPool.cryptoBalance());
        
        assert.equal(token, accounts[1]);
        assert.equal(tokenBalance, 0);
        assert.equal(cryptoBalance, 0);
    });
});

