const InvestmentBank = artifacts.require("InvestmentBank");

module.exports = function (deployer) {
  deployer.deploy(InvestmentBank);
};