import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

/**
 * @title FHEVM Example Repository Generator
 * @notice CLI tool to create standalone FHEVM example repositories
 * @dev This script automates the creation of new FHEVM example projects
 * by scaffolding a complete Hardhat project with:
 * - Base Hardhat configuration
 * - FHEVM dependencies
 * - Example contracts
 * - Comprehensive tests
 * - Documentation
 */

interface ExampleConfig {
  name: string;
  description: string;
  category: string;
  contractName: string;
  chapters: string[];
}

/**
 * @notice Base template files that every example needs
 */
const BASE_TEMPLATE_FILES = {
  ".gitignore": `# Dependencies
node_modules/
npm-debug.log*

# Hardhat
cache/
artifacts/
typechain-types/
coverage/
coverage.json
gas-report

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
`,

  ".env.example": `# Private Key for Deployment
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Gas Reporting
REPORT_GAS=false
`,

  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./",
    "typeRoots": ["./node_modules/@types", "./typechain-types"]
  },
  "include": ["./test/**/*.ts", "./scripts/**/*.ts"],
  "exclude": ["node_modules", "artifacts", "cache", "coverage", "dist"],
  "files": ["./hardhat.config.ts"]
}
`,
};

/**
 * @notice Generate hardhat.config.ts template
 */
function generateHardhatConfig(projectName: string): string {
  return `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * @notice ${projectName} Hardhat Configuration
 * @dev FHEVM example configuration for ${projectName}
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
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },

  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  mocha: {
    timeout: 120000,
  },
};

export default config;
`;
}

/**
 * @notice Generate package.json for the example
 */
function generatePackageJson(config: ExampleConfig): string {
  return JSON.stringify(
    {
      name: `fhevm-${config.name.toLowerCase().replace(/\s+/g, "-")}`,
      version: "1.0.0",
      description: config.description,
      keywords: [
        "fhevm",
        "fhe",
        "privacy",
        "zama",
        "blockchain",
        ...config.chapters,
      ],
      scripts: {
        test: "hardhat test",
        compile: "hardhat compile",
        deploy: "hardhat run scripts/deploy.ts",
        "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
        clean: "hardhat clean",
        coverage: "hardhat coverage",
      },
      devDependencies: {
        "@nomicfoundation/hardhat-chai-matchers": "^2.0.0",
        "@nomicfoundation/hardhat-ethers": "^3.0.0",
        "@nomicfoundation/hardhat-toolbox": "^4.0.0",
        "@typechain/ethers-v6": "^0.5.0",
        "@typechain/hardhat": "^9.0.0",
        "@types/chai": "^4.3.5",
        "@types/mocha": "^10.0.1",
        "@types/node": "^20.5.0",
        chai: "^4.3.7",
        hardhat: "^2.19.0",
        "ts-node": "^10.9.1",
        typescript: "^5.2.0",
      },
      dependencies: {
        "@fhevm/contracts": "^0.3.0",
        "@openzeppelin/contracts": "^5.0.0",
        dotenv: "^16.3.1",
        ethers: "^6.9.0",
      },
      author: "FHEVM Examples",
      license: "MIT",
    },
    null,
    2
  );
}

/**
 * @notice Create a new FHEVM example repository
 * @param config Configuration for the example to create
 * @param outputDir Directory where the example will be created
 */
async function createFHEVMExample(
  config: ExampleConfig,
  outputDir: string
): Promise<void> {
  const projectDir = path.join(
    outputDir,
    config.name.toLowerCase().replace(/\s+/g, "-")
  );

  console.log(`\n🚀 Creating FHEVM Example: ${config.name}`);
  console.log(`📁 Output directory: ${projectDir}\n`);

  // Create directory structure
  const dirs = [
    projectDir,
    path.join(projectDir, "contracts"),
    path.join(projectDir, "test"),
    path.join(projectDir, "scripts"),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Created directory: ${path.relative(outputDir, dir)}`);
    }
  }

  // Create base template files
  for (const [filename, content] of Object.entries(BASE_TEMPLATE_FILES)) {
    const filePath = path.join(projectDir, filename);
    fs.writeFileSync(filePath, content);
    console.log(`✓ Created: ${filename}`);
  }

  // Create hardhat.config.ts
  const hardhatConfig = generateHardhatConfig(config.name);
  fs.writeFileSync(path.join(projectDir, "hardhat.config.ts"), hardhatConfig);
  console.log(`✓ Created: hardhat.config.ts`);

  // Create package.json
  const packageJson = generatePackageJson(config);
  fs.writeFileSync(path.join(projectDir, "package.json"), packageJson);
  console.log(`✓ Created: package.json`);

  console.log(`\n✨ Example repository created successfully!`);
  console.log(`\n📝 Next steps:`);
  console.log(`  1. cd ${path.relative(process.cwd(), projectDir)}`);
  console.log(`  2. npm install`);
  console.log(`  3. Add your contract to contracts/${config.contractName}.sol`);
  console.log(`  4. Add your tests to test/${config.contractName}.test.ts`);
  console.log(`  5. npm test`);
  console.log(`\n🎯 Category: ${config.category}`);
  console.log(`📚 Chapters: ${config.chapters.join(", ")}`);
}

/**
 * @notice CLI entry point
 */
async function main() {
  // Example configuration for Privacy Insurance Claims
  const exampleConfig: ExampleConfig = {
    name: "Privacy Insurance Claims",
    description:
      "Privacy-preserving insurance claims system with encrypted medical data using FHEVM",
    category: "Advanced Examples",
    contractName: "PrivacyInsuranceClaims",
    chapters: ["access-control", "encryption", "user-decryption"],
  };

  const outputDir = process.env.OUTPUT_DIR || path.join(process.cwd(), "examples");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await createFHEVMExample(exampleConfig, outputDir);

  console.log("\n💡 Pro Tip:");
  console.log(
    "   Customize the config above to create different FHEVM examples!"
  );
  console.log("   Add your own contracts, tests, and documentation.\n");
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error creating example:");
    console.error(error);
    process.exit(1);
  });
}

export { createFHEVMExample, ExampleConfig };
