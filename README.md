# Privacy Insurance Claims - FHEVM Example

> **A privacy-preserving insurance claims system built with Fully Homomorphic Encryption (FHE)**

## Overview

This project demonstrates how to build a secure, privacy-preserving medical insurance claims system using Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine). The system allows insurance companies, policy holders, and medical reviewers to process insurance claims while keeping sensitive medical and financial data completely encrypted on-chain.

### What Makes This Example Special?

- **Complete Privacy**: Medical diagnoses, treatment costs, patient ages, and claim amounts remain encrypted throughout the entire claims process
- **Selective Access Control**: Fine-grained permissions allow only authorized reviewers to access specific encrypted data
- **Real-World Use Case**: Demonstrates a practical healthcare application that requires HIPAA-level privacy
- **Production-Ready Patterns**: Shows best practices for FHEVM development including access control, encryption, and user decryption

## Key FHEVM Concepts Demonstrated

### 🔐 Encryption

The contract demonstrates encryption of various data types:

```solidity
// Encrypting a uint32 value (premium amount)
euint32 encryptedPremium = FHE.asEuint32(_monthlyPremium);

// Encrypting a uint64 value (claim amount)
euint64 encryptedClaimAmount = FHE.asEuint64(_claimAmount);

// Multiple encrypted values for medical records
euint32 encryptedDiagnosis = FHE.asEuint32(_diagnosisCode);
euint32 encryptedTreatmentCost = FHE.asEuint32(_treatmentCost);
euint32 encryptedAge = FHE.asEuint32(_patientAge);
euint32 encryptedSeverity = FHE.asEuint32(_severityLevel);
```

### 🔑 Access Control

Demonstrates proper access control patterns for encrypted data:

```solidity
// Grant contract access to encrypted data
FHE.allowThis(encryptedPremium);
FHE.allowThis(encryptedCoverage);

// Grant user access to their own encrypted data
FHE.allow(encryptedPremium, msg.sender);
FHE.allow(encryptedCoverage, msg.sender);

// Grant reviewer access to specific claim data
FHE.allow(claim.encryptedClaimAmount, msg.sender);
FHE.allow(record.encryptedDiagnosis, msg.sender);
```

### 👤 User Decryption

Policy holders can decrypt their own sensitive data while it remains encrypted to others. Authorized reviewers receive temporary decryption access only to claims they are reviewing.

### 📋 Role-Based Permissions

The system implements three distinct roles with different capabilities:

- **Insurance Company**: Full administrative rights, can add/remove reviewers, process payments
- **Authorized Reviewers**: Can review claims and access encrypted medical data for evaluation
- **Policy Holders**: Can create policies, submit claims, and view their own claim history

## Project Structure

```
├── contracts/                  # Solidity smart contracts
│   └── PrivacyInsuranceClaims.sol
├── test/                      # Comprehensive test suite with JSDoc annotations
│   └── PrivacyInsuranceClaims.test.ts
├── scripts/                   # Deployment and utility scripts
│   └── deploy.ts
├── automation/                # Tools for generating examples and documentation
│   ├── create-fhevm-example.ts
│   └── generate-docs.ts
├── frontend/                  # Web interface (optional)
│   ├── index.html
│   └── script.js
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MetaMask or another Web3 wallet

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd PrivacyInsuranceClaims

# Install dependencies
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run coverage
```

### Deploy

```bash
# Deploy to local Hardhat network
npm run deploy

# Deploy to Sepolia testnet
npm run deploy:sepolia
```

## Contract Features

### 1. Policy Creation

Policy holders can create insurance policies with encrypted premium and coverage information:

```solidity
function createPolicy(uint32 _monthlyPremium, uint32 _coverageLimit) external
```

**Key Points:**
- Premium and coverage amounts are encrypted using `FHE.asEuint32()`
- Access control is set up automatically for the policy holder
- Prevents duplicate policies for the same address

### 2. Claim Submission

Policy holders can submit insurance claims with encrypted medical data:

```solidity
function submitClaim(
    uint64 _claimAmount,
    uint32 _diagnosisCode,
    uint32 _treatmentCost,
    uint32 _patientAge,
    uint32 _severityLevel
) external
```

**Key Points:**
- All sensitive medical data is encrypted before storage
- Claim amount uses `euint64` for larger values
- Medical data (diagnosis, treatment cost, age, severity) uses `euint32`
- Automatic tracking of claim history per user

### 3. Claim Review Process

Authorized medical reviewers can review submitted claims:

```solidity
function reviewClaim(uint32 _claimId) external
```

**Key Points:**
- Only authorized reviewers can access encrypted claim data
- FHE.allow() grants temporary access to encrypted medical records
- Tracks all reviewers assigned to each claim
- Status transitions: Submitted → Under Review

### 4. Claim Approval/Rejection

Reviewers can approve or reject claims:

```solidity
function approveClaim(uint32 _claimId) external
function rejectClaim(uint32 _claimId, string memory _reason) external
```

**Key Points:**
- Only claims under review can be approved/rejected
- Rejection includes a reason for transparency
- Status transitions: Under Review → Approved/Rejected

### 5. Payment Processing

Insurance company processes payments for approved claims:

```solidity
function processPayment(uint32 _claimId) external
```

**Key Points:**
- Only insurance company can process payments
- Only approved claims can be paid
- Final status: Paid

## Testing

The project includes a comprehensive test suite demonstrating all features:

### Test Categories

1. **Deployment Tests**: Verify correct contract initialization
2. **Policy Creation Tests**: Test encrypted policy creation with various scenarios
3. **Claim Submission Tests**: Validate encrypted claim submission and data handling
4. **Access Control Tests**: Ensure proper authorization and permission management
5. **Claim Review Tests**: Test the review workflow and encrypted data access
6. **Approval/Rejection Tests**: Verify claim decision workflows
7. **Payment Processing Tests**: Test payment workflows and permissions
8. **Edge Cases**: Handle invalid inputs and boundary conditions

### Running Tests

```bash
# Run all tests with detailed output
npm test

# Run specific test file
npx hardhat test test/PrivacyInsuranceClaims.test.ts

# Run tests with gas reporting
REPORT_GAS=true npm test

# Generate coverage report
npm run coverage
```

## Automation Tools

### Example Generator

Create new FHEVM example repositories with proper structure:

```bash
npm run generate:example
```

This tool scaffolds a complete Hardhat project with:
- Base configuration files
- FHEVM dependencies
- Directory structure
- TypeScript setup

### Documentation Generator

Automatically generate documentation from test annotations:

```bash
npm run generate:docs
```

This tool:
- Parses JSDoc comments from test files
- Generates README.md with examples
- Creates GitBook-compatible chapter files
- Organizes content by @chapter tags

## Security Considerations

### What This Example Does Well

✅ Encrypts all sensitive medical and financial data
✅ Implements proper access control with FHE.allow() and FHE.allowThis()
✅ Uses role-based permissions for different actors
✅ Validates inputs before encryption
✅ Tracks claim lifecycle with clear status transitions

### Production Deployment Checklist

Before using in production, ensure:

- [ ] Professional security audit completed
- [ ] Gas optimization analysis
- [ ] Integration with actual payment systems
- [ ] Compliance verification (HIPAA, GDPR, etc.)
- [ ] Key management strategy
- [ ] Disaster recovery plan
- [ ] Monitoring and alerting setup
- [ ] Rate limiting and DoS protection
- [ ] Upgrade mechanism (proxy pattern)

## FHEVM Learning Resources

### Core Concepts

- **What is FHE?**: Fully Homomorphic Encryption allows computation on encrypted data without decryption
- **FHEVM**: Zama's EVM implementation that supports FHE operations
- **Encrypted Types**: `euint8`, `euint16`, `euint32`, `euint64`, `ebool`, etc.
- **Access Control**: Managing who can decrypt and use encrypted data

### Useful Links

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Contracts Repository](https://github.com/zama-ai/fhevm)
- [Zama Bounty Program](https://www.zama.ai/bounty-program)
- [FHEVM Examples](https://github.com/zama-ai/fhevm-contracts/tree/main/examples)

## Use Cases for FHEVM

This example can be adapted for various privacy-preserving applications:

- **Healthcare**: Medical records, prescription management, clinical trials
- **Finance**: Private transactions, confidential credit scoring, encrypted portfolios
- **Voting**: Anonymous voting systems with verifiable results
- **Identity**: Privacy-preserving KYC, age verification without revealing DOB
- **Supply Chain**: Confidential pricing, private inventory levels
- **DeFi**: Private trading, encrypted order books, confidential assets

## Contributing

Contributions are welcome! Areas for improvement:

- Additional test coverage for edge cases
- Gas optimization strategies
- Frontend improvements
- Additional FHEVM patterns (comparison, arithmetic operations)
- Integration examples with other protocols

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built for the [Zama FHEVM Bounty Program December 2025](https://www.zama.ai/post/zama-bounty-program-december-2025)

Special thanks to:
- Zama team for FHEVM development
- The FHE research community
- All contributors and reviewers

---

## Contact & Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Join the Zama Discord community
- **Documentation**: Check the official Zama docs

**Built with ❤️ using Zama FHEVM - Making Privacy Possible**
