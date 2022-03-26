import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

// import "./tasks/accounts";
// import "./tasks/clean";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { utils } from "ethers";
// import { NetworkUserConfig } from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  matic: 137,
  avalancheCChain: 43114,
};

// // Ensure that we have all the environment variables we need.
// const mnemonic = process.env.MNEMONIC;
// if (!mnemonic) {
//   throw new Error("Please set your MNEMONIC in a .env file");
// }

// Ensure that we have all the environment variables we need.
// const account_private_key = process.env.ACCOUNT_PRIVATE_KEY;
// if (!account_private_key) {
//  throw new Error("Please set your ACCOUNT_PRIVATE_KEY in a .env file");
// }

// const infuraApiKey = process.env.INFURA_API_KEY;
// if (!infuraApiKey) {
//   throw new Error("Please set your INFURA_API_KEY in a .env file");
// }

// function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
//   const url: string = "https://" + network + ".infura.io/v3/" + infuraApiKey;
//   return {
//     accounts: {
//       count: 10,
//       initialIndex: 0,
//       mnemonic,
//       path: "m/44'/60'/0'/0",
//     },
//     chainId: chainIds[network],
//     url,
//   };
// }

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
   matic: {
     url: "https://rpc-mainnet.matic.network",
     gasPrice: utils.parseUnits("1.2", "gwei").toNumber(),
     // gasMultiplier: 25,
    //  accounts: [account_private_key],
     chainId: chainIds.matic,
   },
   avalancheCChain: {
     url: "https://api.avax.network/ext/bc/C/rpc",
     // https://cointool.app/gasPrice/avax
     gasPrice: utils.parseUnits("36", "gwei").toNumber(),
     // gasMultiplier: 25,
    //  accounts: [account_private_key],
     chainId: chainIds.avalancheCChain,
   },
    // goerli: createTestnetConfig("goerli"),
    // kovan: createTestnetConfig("kovan"),
    // rinkeby: createTestnetConfig("rinkeby"),
    // ropsten: createTestnetConfig("ropsten"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.6",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
