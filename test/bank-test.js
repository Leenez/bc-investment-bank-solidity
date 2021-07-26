const truffleAssert = require('truffle-assertions');
const InterestToken = artifacts.require('InterestToken');
const PikachuToken = artifacts.require('PikachuToken');
const YoshiToken = artifacts.require('YoshiToken');
const InvestmentBank = artifacts.require('InvestmentBank');

contract("Contract", accounts => {

    let interestToken;
    let pikachuToken;
    let yoshiToken;
    let investmentBank;

    beforeEach("setup contract for each test case", async () => {
        interestToken = await InterestToken.new({from: accounts[0]});
        pikachuToken = await PikachuToken.new({from: accounts[0]});
        yoshiToken = await YoshiToken.new({from: accounts[0]});
        investmentBank = await InvestmentBank.new({from: accounts[0]});
    });

    it("Only owner can add tokens to the bank", async () => {
        await truffleAssert.passes(
            investmentBank.addToken(web3.utils.utf8ToHex("PIKACHU"), pikachuToken.address, 9, {from: accounts[0]}),
            "Owner can add tokens"
        );
        await truffleAssert.fails(
            investmentBank.addToken(web3.utils.utf8ToHex("YOSHI"), yoshiToken.address, 9, {from: accounts[1]}),
            truffleAssert.ErrorType.REVERT,
            null,
            "Not owners can not add tokens"
        );
    });

    it("Can only do deposits if token exist", async() => {
        await pikachuToken.getTokens(1000, {from: accounts[1]});
        await pikachuToken.approve(investmentBank.address, 500, {from: accounts[1]});
        await yoshiToken.getTokens(1000, {from: accounts[1]});
        await yoshiToken.approve(investmentBank.address, 500, {from: accounts[1]});
        await investmentBank.addToken(web3.utils.utf8ToHex("PIKACHU"), pikachuToken.address, 9, {from: accounts[0]});
        
        await truffleAssert.passes(
            investmentBank.deposit(web3.utils.utf8ToHex("PIKACHU"), 500, {from: accounts[1]}),
            "Account can deposit existing tokens"
        );

        await truffleAssert.fails(
            investmentBank.deposit(web3.utils.utf8ToHex("YOSHI"), 500, {from: accounts[1]}),
            truffleAssert.ErrorType.REVERT,
            null,
            "Account can not deposit non existing tokens"
        );
    });

    it("Deposits correctly if the balance is adequate", async() => {
        await pikachuToken.getTokens(1000000000, {from: accounts[1]});
        await pikachuToken.approve(investmentBank.address, 1000000000, {from: accounts[1]});
        await investmentBank.addToken(web3.utils.utf8ToHex("PIKACHU"), pikachuToken.address, 9, {from: accounts[0]});
        
        await truffleAssert.reverts(
            investmentBank.deposit(web3.utils.utf8ToHex("PIKACHU"), 2000000000, {from: accounts[1]}),
            truffleAssert.ErrorType.REVERT,
            "Should revert with not enough balance"
        );

        await truffleAssert.passes(
            investmentBank.deposit(web3.utils.utf8ToHex("PIKACHU"), 1000000000, {from: accounts[1]}),
            "Should pass with adequate balance"
        );
        
        const balance = await pikachuToken.balanceOf(accounts[1]);
        await assert.equal(0, web3.utils.fromWei(balance.toString(), 'ether'), 
        "Balance should be zero"
        );     
    });

    it("Withdrawals correctly", async() => {
        await investmentBank.setInterestTokenAddress(interestToken.address);
        await pikachuToken.getTokens(5000, {from: accounts[1]});
        await pikachuToken.approve(investmentBank.address, 5000, {from: accounts[1]});
        await investmentBank.addToken(web3.utils.utf8ToHex("PIKACHU"), pikachuToken.address, 1, {from: accounts[0]});
        await interestToken.getTokens(investmentBank.address, 5000000000000, {from: accounts[0]});
        await investmentBank.deposit(web3.utils.utf8ToHex("PIKACHU"), 50, {from: accounts[1]});
        await investmentBank.withdraw(web3.utils.utf8ToHex("PIKACHU"), 50, {from: accounts[1]})
        //balance = await interestToken.balanceOf(accounts[1], {from: accounts[1]});
        //console.log(balance.toString());
    });

});