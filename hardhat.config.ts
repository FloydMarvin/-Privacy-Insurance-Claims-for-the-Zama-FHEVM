import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * @notice Hardhat Configuration for FHEVM Privacy Insurance Claims Example
 * @dev This configuration sets up the development environment for building
 * privacy-preserving insurance claims using Fully Homomorphic Encryption (FHE)
 *
 * Key Features:
 * - Configured for Zama's fhEVM on Sepolia testnet
 * - TypeScript support with TypeChain for type-safe contract interactions
 * - Gas reporting and test coverage enabled
 * - Local Hardhat network for development and testing
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },

  networks: {
    // Local Hardhat Network
    hardhat: {
      chainId: 31337,
      accounts: {
        count: 10,
        accountsBalance: "10000000000000000000000", // 10000 ETH
      },
    },

    // Zama fhEVM Sepolia Testnet
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
  },

  // Gas Reporter Configuration
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    outputFile: "gas-report",
    noColors: true,
  },

  // TypeChain Configuration for Type-Safe Contract Interactions
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
  },

  // Paths Configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  // Mocha Test Configuration
  mocha: {
    timeout: 120000, // 2 minutes for FHE operations
  },

  // Etherscan Verification Configuration
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

export default config;
