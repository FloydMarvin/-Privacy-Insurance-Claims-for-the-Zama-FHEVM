import { ethers } from "hardhat";

/**
 * @title Privacy Insurance Claims Deployment Script
 * @notice Deploys the PrivacyInsuranceClaims contract to the specified network
 * @dev This script handles deployment of the FHEVM-based insurance system
 */
async function main() {
  console.log("🚀 Starting Privacy Insurance Claims deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("⏳ Deploying PrivacyInsuranceClaims contract...");
  const PrivacyInsuranceClaims = await ethers.getContractFactory(
    "PrivacyInsuranceClaims"
  );
  const privacyInsuranceClaims = await PrivacyInsuranceClaims.deploy();

  await privacyInsuranceClaims.waitForDeployment();

  const contractAddress = await privacyInsuranceClaims.getAddress();

  console.log("✅ PrivacyInsuranceClaims deployed to:", contractAddress);
  console.log("🏢 Insurance Company:", deployer.address);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const insuranceCompany = await privacyInsuranceClaims.insuranceCompany();
  const [totalClaims, nextClaimId] = await privacyInsuranceClaims.getSystemStats();
  const isAuthorized = await privacyInsuranceClaims.isAuthorizedReviewer(
    deployer.address
  );

  console.log("  ✓ Insurance Company:", insuranceCompany);
  console.log("  ✓ Next Claim ID:", nextClaimId);
  console.log("  ✓ Total Claims:", totalClaims);
  console.log("  ✓ Deployer authorized as reviewer:", isAuthorized);

  console.log("\n📋 Deployment Summary:");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Contract Address:     ", contractAddress);
  console.log("Network:              ", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:             ", (await ethers.provider.getNetwork()).chainId);
  console.log("Deployer:             ", deployer.address);
  console.log("Gas Used:             ", "Check transaction receipt");
  console.log("═══════════════════════════════════════════════════════");

  console.log("\n💡 Next Steps:");
  console.log("1. Save the contract address for your records");
  console.log("2. Add authorized reviewers using addReviewer()");
  console.log("3. Verify the contract on Etherscan (if on public network)");
  console.log("4. Update your .env file with CONTRACT_ADDRESS");
  console.log("\n✨ Deployment completed successfully!");

  return contractAddress;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
