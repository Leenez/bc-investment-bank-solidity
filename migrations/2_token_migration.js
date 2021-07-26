const InterestToken = artifacts.require("InterestToken");
const YoshiToken = artifacts.require("YoshiToken");
const PikachuToken = artifacts.require("PikachuToken");

module.exports = function (deployer) {
  deployer.deploy(InterestToken);
  deployer.deploy(YoshiToken);
  deployer.deploy(PikachuToken);
};