# Video Demonstration Script

> **Required for Zama Bounty Submission**: Create a video demonstrating the project setup, key features, and code highlights.

## Video Structure (5-10 minutes recommended)

### 1. Introduction (30 seconds)

**Script:**
```
Hello! I'm demonstrating my submission for the Zama FHEVM Bounty Program December 2025.

This project is called "Privacy Insurance Claims" - a privacy-preserving medical
insurance claims system built with Fully Homomorphic Encryption.

It demonstrates how sensitive medical data and financial information can remain
completely encrypted on-chain while still allowing authorized parties to process
insurance claims.
```

**Show:** Project title screen or README header

---

### 2. Project Overview (1 minute)

**Script:**
```
Let me show you the project structure. This is a complete Hardhat-based FHEVM example
with everything the bounty requires:

- Comprehensive Solidity contract with encrypted medical records
- Test suite with extensive JSDoc annotations
- Automation scripts for generating new examples
- Documentation generator that creates GitBook-compatible docs
- And a complete README with examples and explanations
```

**Show:**
- Directory structure in VS Code
- Briefly highlight key folders: contracts/, test/, automation/, scripts/

---

### 3. Smart Contract Features (2 minutes)

**Script:**
```
The core smart contract demonstrates three key FHEVM concepts:

First, ENCRYPTION - All sensitive data is encrypted using FHE types.
[Show code] Here we encrypt policy premiums, coverage limits, claim amounts,
medical diagnoses, treatment costs, and patient ages.

Second, ACCESS CONTROL - We use FHE.allow and FHE.allowThis to manage who can
access encrypted data.
[Show code] The contract grants itself access, allows users to see their own data,
and grants reviewers temporary access to specific claims.

Third, ROLE-BASED PERMISSIONS - We have three roles: Insurance Company, Authorized
Reviewers, and Policy Holders, each with different capabilities.
```

**Show:**
- Open `contracts/PrivacyInsuranceClaims.sol`
- Highlight encryption code (lines 101-102, 136-140)
- Highlight access control code (lines 113-116, 194-200)
- Highlight role modifiers (lines 64-77)

---

### 4. Test Suite with Annotations (1.5 minutes)

**Script:**
```
The test suite is comprehensive and uses JSDoc annotations for documentation
generation, which is a key requirement for the bounty.

[Show code] Each test has @title, @notice, @dev, and @chapter tags that
the documentation generator parses.

We have tests for every feature:
- Policy creation with encrypted data
- Claim submission with medical information
- Access control and authorization
- The full claim review and approval workflow
- Payment processing
- Edge cases and security

Running the tests shows everything works correctly.
```

**Show:**
- Open `test/PrivacyInsuranceClaims.test.ts`
- Highlight JSDoc comments (lines 7-16, 30-36)
- Run `npm test` and show passing tests

---

### 5. Automation Tools (1.5 minutes)

**Script:**
```
This project includes two automation scripts as required by the bounty.

First, create-fhevm-example.ts - This CLI tool scaffolds new FHEVM example
repositories. It creates the directory structure, base configuration files,
and all the boilerplate needed to start a new example.

Second, generate-docs.ts - This tool parses JSDoc comments from test files
and generates complete documentation including a README, chapter files,
and GitBook summaries.

Let me demonstrate the documentation generator.
[Run command] As you can see, it parsed our test annotations and created
comprehensive documentation.
```

**Show:**
- Open `automation/create-fhevm-example.ts` - highlight key functions
- Open `automation/generate-docs.ts` - highlight parsing logic
- Run `npm run generate:docs` in terminal
- Show generated files in docs/ directory

---

### 6. Documentation Quality (1 minute)

**Script:**
```
The README provides a complete guide with:
- Overview of FHEVM concepts demonstrated
- Code examples with explanations
- Quick start instructions
- Security considerations
- And links to learning resources

The documentation is organized by chapters matching the bounty requirements:
- Access Control
- Encryption patterns
- User Decryption
```

**Show:**
- Scroll through README.md highlighting sections
- Show generated docs/ folder with chapter files

---

### 7. Real-World Application (1 minute)

**Script:**
```
This example solves a real problem in healthcare: processing insurance claims
while maintaining patient privacy.

The system allows:
- Patients to submit claims without revealing medical details publicly
- Reviewers to access only the claims they're authorized to see
- The insurance company to process payments without exposing sensitive data

This same pattern can be adapted for other privacy-sensitive applications like
voting systems, private financial transactions, or confidential supply chains.
```

**Show:**
- Open README.md "Use Cases" section
- Highlight the real-world benefits

---

### 8. Conclusion (30 seconds)

**Script:**
```
To summarize, this submission includes:
✓ A complete standalone Hardhat repository
✓ FHEVM smart contract demonstrating encryption and access control
✓ Comprehensive test suite with documentation annotations
✓ Automation scripts for example generation
✓ Documentation generator creating GitBook-compatible output
✓ Complete README with learning resources

Thank you for reviewing my submission for the Zama FHEVM Bounty Program!
```

**Show:**
- Project summary screen or README
- Your contact info (GitHub, etc.)

---

## Recording Tips

### Technical Setup

1. **Screen Resolution**: 1920x1080 recommended
2. **Screen Recording Tool**:
   - OBS Studio (free, cross-platform)
   - Loom (easy, web-based)
   - QuickTime (Mac)
   - Windows Game Bar (Windows)

3. **Audio**: Use a decent microphone, minimize background noise

4. **IDE Setup**:
   - Use a clean theme with good contrast
   - Increase font size to 16-18pt for readability
   - Close unnecessary tabs and windows

### Before Recording

- [ ] Close distracting applications
- [ ] Clear terminal history
- [ ] Reset your workspace to a clean state
- [ ] Test your microphone
- [ ] Practice the script once
- [ ] Have the code files open in tabs
- [ ] Prepare terminal commands in advance

### During Recording

- **Pace**: Speak clearly and not too fast
- **Show, Don't Tell**: Let viewers see the code while you explain
- **Cursor Movement**: Move slowly, highlight important sections
- **Pauses**: Brief pause when switching between topics
- **Energy**: Stay enthusiastic but natural

### After Recording

- **Edit Out**: Long pauses, mistakes, "um"s
- **Add**: Title screen, timestamps, captions (optional)
- **Upload**: YouTube (unlisted or public), Vimeo, or cloud storage
- **Test**: Watch the video once to ensure quality

---

## Alternative: Live Demo Recording

If you prefer showing actual execution:

1. **Setup Phase** (2 min)
   - Show `npm install`
   - Show `npm run compile`

2. **Testing Phase** (2 min)
   - Run `npm test`
   - Show tests passing with green checkmarks

3. **Deployment Demo** (1 min)
   - Run `npm run deploy` on local network
   - Show deployment success

4. **Code Walkthrough** (3-4 min)
   - Walk through key contract functions
   - Explain FHEVM concepts

---

## Video Checklist

Before submitting your video:

- [ ] Video is 5-10 minutes long
- [ ] Audio is clear and understandable
- [ ] Code is visible and readable
- [ ] All key features are demonstrated
- [ ] Setup process is shown
- [ ] Tests are shown running
- [ ] Automation scripts are demonstrated
- [ ] Video is uploaded and accessible
- [ ] Video link is included in submission

---

## Example Video Titles

- "Privacy Insurance Claims - Zama FHEVM Bounty Submission"
- "FHEVM Example: Privacy-Preserving Insurance Claims System"
- "Building Privacy-First Healthcare with FHEVM - Bounty Demo"

---

Good luck with your video! Remember: clarity and completeness are more important
than production quality. Show your work, explain your thinking, and demonstrate
that everything works as intended.
