// SPDX-License-Identifier: MIT
const FurnitureMarketplace = artifacts.require("./contracts/FurnitureMarketplace");

module.exports = function (deployer) {
  deployer.deploy(FurnitureMarketplace);
};
