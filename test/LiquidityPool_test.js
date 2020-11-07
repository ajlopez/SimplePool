
const LiquidityPool = artifacts.require('LiquidityPool');
const BasicToken = artifacts.require('BasicToken');

contract('LiquidityPool', function (accounts) {   
    let liquidityPool;
    let token;
    
    const root = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];
    
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
    
    it('buy tokens', async function () {
        await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
        await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });

        await liquidityPool.buyTokens({ from: bob, value: 1000000 });
        
        const bobTokens = Number(await token.balanceOf(bob));
        const cryptoBalance = Number(await liquidityPool.cryptoBalance());
        const tokenBalance = Number(await liquidityPool.tokenBalance());
        const poolTokens = Number(await token.balanceOf(liquidityPool.address));
        const poolBalance = Number(await web3.eth.getBalance(liquidityPool.address));

        assert.equal(bobTokens, 500);
        assert.equal(poolTokens, 500);
        assert.equal(poolBalance, 2000000);
        assert.equal(cryptoBalance, 2000000);
        assert.equal(tokenBalance, 500);
    });
    
    it('sell tokens', async function () {
        await token.transfer(bob, 1000000);
        await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
        await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });

        await token.approve(liquidityPool.address, 1000, { from: bob, gasPrice: 0 });
        await liquidityPool.sellTokens(1000, { from: bob });
        
        const bobTokens = Number(await token.balanceOf(bob));
        const cryptoBalance = Number(await liquidityPool.cryptoBalance());
        const tokenBalance = Number(await liquidityPool.tokenBalance());
        const poolTokens = Number(await token.balanceOf(liquidityPool.address));
        const poolBalance = Number(await web3.eth.getBalance(liquidityPool.address));

        assert.equal(bobTokens, 1000000 - 1000);
        assert.equal(poolTokens, 2000);
        assert.equal(poolBalance, 500000);
        assert.equal(cryptoBalance, 500000);
        assert.equal(tokenBalance, 2000);
    });
});

