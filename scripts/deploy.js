const hre = require("hardhat");

async function main() {
  console.log("Deploying FaidaInvestment contract...");

  const FaidaInvestment = await hre.ethers.getContractFactory("FaidaInvestment");
  const faidaInvestment = await FaidaInvestment.deploy();

  await faidaInvestment.deployed();

  console.log("FaidaInvestment deployed to:", faidaInvestment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 