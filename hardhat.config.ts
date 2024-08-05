import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {},
  },
  etherscan: {
    apiKey: {
      sepolia: process.env["ETHSCAN_KEY"] || "",
    },
  },
};

if (process.env.ETH_PROVIDER_ENDPOINT_TESTNET) {
  config.networks!.sepolia = {
    url: process.env.ETH_PROVIDER_ENDPOINT_TESTNET,
    accounts: [`${process.env.ETHEREUM_PRIVATE_KEY}`],
  };
}

export default config;
