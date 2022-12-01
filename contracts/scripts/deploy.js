// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Grant = await hre.ethers.getContractFactory("UbeGrants");
  const grant = await Grant.deploy("0x2F069F429d036aeBD2dC13de8B63C16AE9f8bB1a", "0xc94dd466416A7dFE166aB2cF916D3875C049EBB7");

  await grant.deployed();

  console.log("Greeter deployed to:", grant.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
