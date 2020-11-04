
const LiquidityPool = artifacts.require('LiquidityPool');
const BasicToken = artifacts.require('BasicToken');

contract('LiquidityPool', function (accounts) {   
    let liquidityPool;
    let token;
    
    const root = accounts[0];
    const alice = accounts[1];
    
    beforeEach(async function () {
        token = await BasicToken.new('Token', 'TOK');
        await token.transfer(alice, 1000000);
        liquidityPool = await LiquidityPool.new(token.address);
    });
    
    it('create contract', async function () {
        const poolToken = await liquidityPool.token();
        const tokenBalance = Number(await liquidityPool.tokenBalance());
        const cryptoBalance = Number(await liquidityPool.cryptoBalance());
        
        assert.equal(poolToken, token.address);
        assert.equal(tokenBalance, 0);
        assert.equal(cryptoBalance, 0);
    });
    
    it('first funds', async function () {
        const initialAliceTokenBalance = Number(await token.balanceOf(alice));
        const initialAliceBalance = Number(await web3.eth.getBalance(alice));
        const initialPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
        const initialPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
        
        await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
        await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });

        const finalAliceTokenBalance = Number(await token.balanceOf(alice));
        const finalAliceBalance = Number(await web3.eth.getBalance(alice));
        const finalPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
        const finalPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
        
        assert.equal(finalAliceBalance, initialAliceBalance - 1000000);
        assert.equal(finalAliceTokenBalance, initialAliceTokenBalance - 1000);
        assert.equal(finalPoolBalance, initialPoolBalance + 1000000);
        assert.equal(finalPoolTokenBalance, initialPoolTokenBalance + 1000);
    });
});

