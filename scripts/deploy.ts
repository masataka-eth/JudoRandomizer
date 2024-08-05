import { ethers } from "hardhat";
// import { Contract, ContractFactory } from "ethers";

async function main() {
  const subscriptionId = "12345"; // your subscriptionId
  const vrfCoordinator = "0x9ddfaca8183c41ad55329bdeed9f6a8d53168b1b"; // your vrfCoordinator

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const JudoRandomizer = await ethers.getContractFactory("JudoRandomizer");
  const judoRandomizer = await JudoRandomizer.deploy(
    BigInt(subscriptionId), // uint64に変換
    vrfCoordinator
  );

  await judoRandomizer.waitForDeployment();

  console.log("JudoRandomizer deployed to:", await judoRandomizer.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
