
const LiquidityPool = artifacts.require('LiquidityPool');
const BasicToken = artifacts.require('BasicToken');

const truffleAssert = require('truffle-assertions');

contract('LiquidityPool', function (accounts) {   
    let liquidityPool;
    let token;
    
    const root = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];
    
    describe('deposits', function () {
        beforeEach(async function () {
            token = await BasicToken.new('Token', 'TOK');
            await token.transfer(alice, 1000000);
            liquidityPool = await LiquidityPool.new(token.address);
        });
        
        it('initial state', async function () {
            const poolToken = await liquidityPool.token();
            const tokenBalance = Number(await liquidityPool.tokenBalance());
            const cryptoBalance = Number(await liquidityPool.cryptoBalance());
            
            assert.equal(poolToken, token.address);
            assert.equal(tokenBalance, 0);
            assert.equal(cryptoBalance, 0);
        });
        
        it('deposit funds', async function () {
            const initialAliceTokenBalance = Number(await token.balanceOf(alice));
            const initialAliceBalance = Number(await web3.eth.getBalance(alice));
            const initialPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const initialPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
            
            const txresult = await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });
            
            truffleAssert.eventEmitted(txresult, 'Deposit',
                function (ev) {
                    return ev.user.toLowerCase() === alice.toLowerCase() &&
                        Number(ev.value) === 1000000 &&
                        Number(ev.tokenAmount) === 1000;
                }
            );

            const finalAliceTokenBalance = Number(await token.balanceOf(alice));
            const finalAliceBalance = Number(await web3.eth.getBalance(alice));
            const finalPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const finalPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            assert.equal(finalAliceBalance, initialAliceBalance - 1000000);
            assert.equal(finalAliceTokenBalance, initialAliceTokenBalance - 1000);
            assert.equal(finalPoolBalance, initialPoolBalance + 1000000);
            assert.equal(finalPoolTokenBalance, initialPoolTokenBalance + 1000);
        });
        
        it('deposit rejected if less tokens are approved', async function () {
            const initialAliceTokenBalance = Number(await token.balanceOf(alice));
            const initialAliceBalance = Number(await web3.eth.getBalance(alice));
            const initialPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const initialPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            await token.approve(liquidityPool.address, 500, { from: alice, gasPrice: 0 });
            await truffleAssert.reverts(liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 }));

            const finalAliceTokenBalance = Number(await token.balanceOf(alice));
            const finalAliceBalance = Number(await web3.eth.getBalance(alice));
            const finalPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const finalPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            assert.equal(finalAliceBalance, initialAliceBalance);
            assert.equal(finalAliceTokenBalance, initialAliceTokenBalance);
            assert.equal(finalPoolBalance, initialPoolBalance);
            assert.equal(finalPoolTokenBalance, initialPoolTokenBalance);
        });
        
        it('two deposits', async function () {
            const initialAliceTokenBalance = Number(await token.balanceOf(alice));
            const initialAliceBalance = Number(await web3.eth.getBalance(alice));
            const initialPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const initialPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
            await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });
            await token.approve(liquidityPool.address, 100, { from: alice, gasPrice: 0 });
            await liquidityPool.deposit(100, { value: 100000, from: alice, gasPrice: 0 });

            const finalAliceTokenBalance = Number(await token.balanceOf(alice));
            const finalAliceBalance = Number(await web3.eth.getBalance(alice));
            const finalPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const finalPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            assert.equal(finalAliceBalance, initialAliceBalance - 1100000);
            assert.equal(finalAliceTokenBalance, initialAliceTokenBalance - 1100);
            assert.equal(finalPoolBalance, initialPoolBalance + 1100000);
            assert.equal(finalPoolTokenBalance, initialPoolTokenBalance + 1100);
        });
        
        it('second deposit with too much tokens', async function () {
            const initialAliceTokenBalance = Number(await token.balanceOf(alice));
            const initialAliceBalance = Number(await web3.eth.getBalance(alice));
            const initialPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const initialPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
            await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });
            await token.approve(liquidityPool.address, 200, { from: alice, gasPrice: 0 });
            
            const txresult = await liquidityPool.deposit(200, { value: 100000, from: alice, gasPrice: 0 });

            truffleAssert.eventEmitted(txresult, 'Deposit',
                function (ev) {
                    return ev.user.toLowerCase() === alice.toLowerCase() &&
                        Number(ev.value) === 100000 &&
                        Number(ev.tokenAmount) === 100;
                }
            );
            
            const finalAliceTokenBalance = Number(await token.balanceOf(alice));
            const finalAliceBalance = Number(await web3.eth.getBalance(alice));
            const finalPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const finalPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            assert.equal(finalAliceBalance, initialAliceBalance - 1100000);
            assert.equal(finalAliceTokenBalance, initialAliceTokenBalance - 1100);
            assert.equal(finalPoolBalance, initialPoolBalance + 1100000);
            assert.equal(finalPoolTokenBalance, initialPoolTokenBalance + 1100);
        });
        
        it('second deposit with not enought tokens', async function () {
            const initialAliceTokenBalance = Number(await token.balanceOf(alice));
            const initialAliceBalance = Number(await web3.eth.getBalance(alice));
            const initialPoolTokenBalance = Number(await token.balanceOf(liquidityPool.address));
            const initialPoolBalance = Number(await web3.eth.getBalance(liquidityPool.address));
            
            await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
            await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });
            await token.approve(liquidityPool.address, 99, { from: alice, gasPrice: 0 });
            await truffleAssert.reverts(liquidityPool.deposit(99, { value: 100000, from: alice, gasPrice: 0 }));

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
    

    describe('buy and sell', function () {
        beforeEach(async function () {
            token = await BasicToken.new('Token', 'TOK');
            await token.transfer(alice, 1000000);
            liquidityPool = await LiquidityPool.new(token.address);
            
            await token.approve(liquidityPool.address, 1000, { from: alice, gasPrice: 0 });
            await liquidityPool.deposit(1000, { value: 1000000, from: alice, gasPrice: 0 });
        });
        
        it('buy tokens', async function () {
            const txresult = await liquidityPool.buyTokens({ from: bob, value: 1000000 });
            
            truffleAssert.eventEmitted(txresult, 'BuyTokens',
                function (ev) {
                    return ev.user.toLowerCase() === bob.toLowerCase() &&
                        Number(ev.value) === 1000000 &&
                        Number(ev.tokenAmount) === 500;
                }
            );
            
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

            await token.approve(liquidityPool.address, 1000, { from: bob, gasPrice: 0 });
            
            const txresult = await liquidityPool.sellTokens(1000, { from: bob });
            
            truffleAssert.eventEmitted(txresult, 'SellTokens',
                function (ev) {
                    return ev.user.toLowerCase() === bob.toLowerCase() &&
                        Number(ev.value) === 500000 &&
                        Number(ev.tokenAmount) === 1000;
                }
            );
            
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
        
        it('cannot sell tokens without approve', async function () {
            await token.transfer(bob, 1000000);

            await truffleAssert.reverts(liquidityPool.sellTokens(1000, { from: bob }));
        });
    });
});

