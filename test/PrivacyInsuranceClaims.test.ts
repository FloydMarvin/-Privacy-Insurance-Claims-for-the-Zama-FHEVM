import { expect } from "chai";
import { ethers } from "hardhat";
import { PrivacyInsuranceClaims } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

/**
 * @title Privacy Insurance Claims Test Suite
 * @notice Comprehensive tests for FHEVM-based privacy-preserving insurance claims system
 * @dev This test suite demonstrates key FHEVM concepts:
 * - Encryption of sensitive medical and financial data
 * - Access control for encrypted data (FHE.allow, FHE.allowThis)
 * - Role-based permissions for reviewers and insurance companies
 * - Privacy-preserving claim lifecycle management
 *
 * @chapter access-control
 * @chapter encryption
 * @chapter user-decryption
 */
describe("Privacy Insurance Claims", function () {
  let privacyInsuranceClaims: PrivacyInsuranceClaims;
  let insuranceCompany: SignerWithAddress;
  let policyHolder1: SignerWithAddress;
  let policyHolder2: SignerWithAddress;
  let reviewer1: SignerWithAddress;
  let reviewer2: SignerWithAddress;
  let unauthorized: SignerWithAddress;

  /**
   * @notice Deploy the contract before each test
   * @dev Sets up test accounts with different roles:
   * - insuranceCompany: Owner and admin
   * - policyHolder1, policyHolder2: Users who can create policies and submit claims
   * - reviewer1, reviewer2: Authorized to review claims
   * - unauthorized: Account with no special permissions
   */
  beforeEach(async function () {
    [insuranceCompany, policyHolder1, policyHolder2, reviewer1, reviewer2, unauthorized] =
      await ethers.getSigners();

    const PrivacyInsuranceClaimsFactory = await ethers.getContractFactory(
      "PrivacyInsuranceClaims"
    );
    privacyInsuranceClaims = await PrivacyInsuranceClaimsFactory.connect(
      insuranceCompany
    ).deploy();
    await privacyInsuranceClaims.waitForDeployment();
  });

  /**
   * @title Contract Deployment Tests
   * @notice Verify correct initialization of the contract
   */
  describe("Deployment", function () {
    /**
     * @notice Should set the deployer as the insurance company
     * @dev The insurance company has full administrative rights
     */
    it("Should set the correct insurance company", async function () {
      expect(await privacyInsuranceClaims.insuranceCompany()).to.equal(
        insuranceCompany.address
      );
    });

    /**
     * @notice Should initialize the claim ID counter correctly
     * @dev nextClaimId starts at 1, totalClaims at 0
     */
    it("Should initialize nextClaimId and totalClaims correctly", async function () {
      const [totalClaims, nextClaimId] = await privacyInsuranceClaims.getSystemStats();
      expect(nextClaimId).to.equal(1);
      expect(totalClaims).to.equal(0);
    });

    /**
     * @notice Should automatically authorize the insurance company as a reviewer
     * @dev The deployer is added to authorizedReviewers mapping
     */
    it("Should authorize insurance company as reviewer on deployment", async function () {
      expect(
        await privacyInsuranceClaims.isAuthorizedReviewer(insuranceCompany.address)
      ).to.be.true;
    });
  });

  /**
   * @title Policy Creation Tests
   * @notice Tests for creating insurance policies with encrypted data
   * @dev Demonstrates FHEVM encryption and access control patterns
   * @chapter encryption
   * @chapter access-control
   */
  describe("Policy Creation", function () {
    /**
     * @notice Should create a policy with encrypted premium and coverage
     * @dev Demonstrates:
     * - FHE.asEuint32() for encrypting uint32 values
     * - FHE.allowThis() to grant contract access to encrypted data
     * - FHE.allow() to grant user access to their encrypted data
     */
    it("Should create policy with encrypted details", async function () {
      const monthlyPremium = 500;
      const coverageLimit = 100000;

      await expect(
        privacyInsuranceClaims
          .connect(policyHolder1)
          .createPolicy(monthlyPremium, coverageLimit)
      )
        .to.emit(privacyInsuranceClaims, "PolicyCreated")
        .withArgs(policyHolder1.address, await time.latest());

      const [isActive, policyStartDate, claimCount] =
        await privacyInsuranceClaims.getPolicyStatus(policyHolder1.address);

      expect(isActive).to.be.true;
      expect(policyStartDate).to.be.gt(0);
      expect(claimCount).to.equal(0);
    });

    /**
     * @notice Should reject policy creation if one already exists
     * @dev Prevents duplicate policies for the same address
     */
    it("Should prevent creating duplicate policies", async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);

      await expect(
        privacyInsuranceClaims.connect(policyHolder1).createPolicy(500, 100000)
      ).to.be.revertedWith("Policy already exists");
    });

    /**
     * @notice Should reject invalid policy parameters
     * @dev Validates premium and coverage are greater than zero
     */
    it("Should reject zero premium or coverage", async function () {
      await expect(
        privacyInsuranceClaims.connect(policyHolder1).createPolicy(0, 100000)
      ).to.be.revertedWith("Premium must be greater than 0");

      await expect(
        privacyInsuranceClaims.connect(policyHolder1).createPolicy(500, 0)
      ).to.be.revertedWith("Coverage must be greater than 0");
    });
  });

  /**
   * @title Claim Submission Tests
   * @notice Tests for submitting insurance claims with encrypted medical data
   * @dev Demonstrates encryption of sensitive medical information
   * @chapter encryption
   * @chapter access-control
   */
  describe("Claim Submission", function () {
    beforeEach(async function () {
      // Create policy first
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);
    });

    /**
     * @notice Should submit claim with encrypted medical data
     * @dev Demonstrates:
     * - FHE.asEuint64() for larger claim amounts
     * - FHE.asEuint32() for medical data (diagnosis, treatment cost, age, severity)
     * - Multiple encrypted values in one transaction
     * - Proper access control setup for encrypted data
     */
    it("Should submit claim with encrypted medical data", async function () {
      const claimAmount = 5000;
      const diagnosisCode = 12345;
      const treatmentCost = 4500;
      const patientAge = 45;
      const severityLevel = 6;

      await expect(
        privacyInsuranceClaims
          .connect(policyHolder1)
          .submitClaim(
            claimAmount,
            diagnosisCode,
            treatmentCost,
            patientAge,
            severityLevel
          )
      )
        .to.emit(privacyInsuranceClaims, "ClaimSubmitted")
        .withArgs(1, policyHolder1.address, await time.latest());

      const [, , , , , totalClaims] = await privacyInsuranceClaims.getClaimInfo(1);
      expect(totalClaims).to.equal(0); // No reviewers yet
    });

    /**
     * @notice Should reject claims from users without active policies
     * @dev Access control: Only policy holders can submit claims
     */
    it("Should reject claims without active policy", async function () {
      await expect(
        privacyInsuranceClaims
          .connect(policyHolder2)
          .submitClaim(5000, 12345, 4500, 45, 6)
      ).to.be.revertedWith("No active policy");
    });

    /**
     * @notice Should validate claim parameters
     * @dev Ensures medical data integrity before encryption
     */
    it("Should validate claim parameters", async function () {
      await expect(
        privacyInsuranceClaims
          .connect(policyHolder1)
          .submitClaim(0, 12345, 4500, 45, 6)
      ).to.be.revertedWith("Claim amount must be greater than 0");

      await expect(
        privacyInsuranceClaims
          .connect(policyHolder1)
          .submitClaim(5000, 12345, 4500, 45, 11)
      ).to.be.revertedWith("Severity must be 1-10");

      await expect(
        privacyInsuranceClaims
          .connect(policyHolder1)
          .submitClaim(5000, 12345, 4500, 150, 6)
      ).to.be.revertedWith("Invalid age");
    });

    /**
     * @notice Should increment claim counters correctly
     * @dev Tracks system-wide and per-user claim counts
     */
    it("Should increment claim counters", async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(5000, 12345, 4500, 45, 6);

      const [totalClaims, nextClaimId] =
        await privacyInsuranceClaims.getSystemStats();
      expect(totalClaims).to.equal(1);
      expect(nextClaimId).to.equal(2);

      const [, , claimCount] = await privacyInsuranceClaims.getPolicyStatus(
        policyHolder1.address
      );
      expect(claimCount).to.equal(1);
    });

    /**
     * @notice Should allow multiple claims from same policy holder
     * @dev Users can submit multiple claims over time
     */
    it("Should allow multiple claims from same policy holder", async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(5000, 12345, 4500, 45, 6);

      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(3000, 67890, 2800, 45, 4);

      const userClaims = await privacyInsuranceClaims.getUserClaims(
        policyHolder1.address
      );
      expect(userClaims.length).to.equal(2);
      expect(userClaims[0]).to.equal(1);
      expect(userClaims[1]).to.equal(2);
    });
  });

  /**
   * @title Access Control Tests
   * @notice Tests for managing authorized reviewers
   * @dev Demonstrates role-based access control patterns
   * @chapter access-control
   */
  describe("Reviewer Management", function () {
    /**
     * @notice Should add authorized reviewer
     * @dev Only insurance company can add reviewers
     */
    it("Should add reviewer by insurance company", async function () {
      await expect(
        privacyInsuranceClaims.connect(insuranceCompany).addReviewer(reviewer1.address)
      )
        .to.emit(privacyInsuranceClaims, "ReviewerAdded")
        .withArgs(reviewer1.address, await time.latest());

      expect(
        await privacyInsuranceClaims.isAuthorizedReviewer(reviewer1.address)
      ).to.be.true;
    });

    /**
     * @notice Should prevent duplicate reviewer additions
     */
    it("Should prevent adding duplicate reviewers", async function () {
      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .addReviewer(reviewer1.address);

      await expect(
        privacyInsuranceClaims.connect(insuranceCompany).addReviewer(reviewer1.address)
      ).to.be.revertedWith("Already authorized");
    });

    /**
     * @notice Should remove reviewer by insurance company
     */
    it("Should remove reviewer", async function () {
      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .addReviewer(reviewer1.address);

      await expect(
        privacyInsuranceClaims
          .connect(insuranceCompany)
          .removeReviewer(reviewer1.address)
      )
        .to.emit(privacyInsuranceClaims, "ReviewerRemoved")
        .withArgs(reviewer1.address, await time.latest());

      expect(
        await privacyInsuranceClaims.isAuthorizedReviewer(reviewer1.address)
      ).to.be.false;
    });

    /**
     * @notice Should prevent removing insurance company as reviewer
     */
    it("Should prevent removing insurance company", async function () {
      await expect(
        privacyInsuranceClaims
          .connect(insuranceCompany)
          .removeReviewer(insuranceCompany.address)
      ).to.be.revertedWith("Cannot remove company");
    });

    /**
     * @notice Should reject reviewer operations from unauthorized users
     */
    it("Should reject reviewer operations from non-insurance company", async function () {
      await expect(
        privacyInsuranceClaims.connect(unauthorized).addReviewer(reviewer1.address)
      ).to.be.revertedWith("Not authorized insurance company");

      await expect(
        privacyInsuranceClaims.connect(unauthorized).removeReviewer(reviewer1.address)
      ).to.be.revertedWith("Not authorized insurance company");
    });
  });

  /**
   * @title Claim Review Tests
   * @notice Tests for reviewing claims and accessing encrypted data
   * @dev Demonstrates selective access control to encrypted data
   * @chapter access-control
   * @chapter user-decryption
   */
  describe("Claim Review", function () {
    beforeEach(async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);

      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(5000, 12345, 4500, 45, 6);

      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .addReviewer(reviewer1.address);
    });

    /**
     * @notice Should allow authorized reviewer to review claims
     * @dev Demonstrates:
     * - FHE.allow() granting reviewer access to specific encrypted data
     * - Status transition: Submitted -> UnderReview
     * - Tracking reviewers per claim
     */
    it("Should allow authorized reviewer to review claim", async function () {
      await expect(
        privacyInsuranceClaims.connect(reviewer1).reviewClaim(1)
      )
        .to.emit(privacyInsuranceClaims, "ClaimStatusUpdated")
        .withArgs(1, 1, await time.latest()); // Status: UnderReview = 1

      const [, status, , , , reviewerCount] =
        await privacyInsuranceClaims.getClaimInfo(1);
      expect(status).to.equal(1); // UnderReview
      expect(reviewerCount).to.equal(1);
    });

    /**
     * @notice Should allow insurance company to review claims
     * @dev Insurance company is automatically authorized
     */
    it("Should allow insurance company to review claim", async function () {
      await expect(
        privacyInsuranceClaims.connect(insuranceCompany).reviewClaim(1)
      ).to.not.be.reverted;
    });

    /**
     * @notice Should reject review from unauthorized users
     * @dev Access control: Only authorized reviewers can access encrypted data
     */
    it("Should reject review from unauthorized user", async function () {
      await expect(
        privacyInsuranceClaims.connect(unauthorized).reviewClaim(1)
      ).to.be.revertedWith("Not authorized reviewer");
    });

    /**
     * @notice Should only allow reviewing submitted claims
     * @dev Claims must be in Submitted status to be reviewed
     */
    it("Should only review claims in submitted status", async function () {
      await privacyInsuranceClaims.connect(reviewer1).reviewClaim(1);

      await expect(
        privacyInsuranceClaims.connect(reviewer1).reviewClaim(1)
      ).to.be.revertedWith("Claim not in submitted status");
    });
  });

  /**
   * @title Claim Approval Tests
   * @notice Tests for approving reviewed claims
   */
  describe("Claim Approval", function () {
    beforeEach(async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);

      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(5000, 12345, 4500, 45, 6);

      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .addReviewer(reviewer1.address);

      await privacyInsuranceClaims.connect(reviewer1).reviewClaim(1);
    });

    /**
     * @notice Should approve claim after review
     * @dev Status transition: UnderReview -> Approved
     */
    it("Should approve claim after review", async function () {
      await expect(
        privacyInsuranceClaims.connect(reviewer1).approveClaim(1)
      )
        .to.emit(privacyInsuranceClaims, "ClaimApproved")
        .withArgs(1, policyHolder1.address, await time.latest());

      const [, status, , , processedTime] =
        await privacyInsuranceClaims.getClaimInfo(1);
      expect(status).to.equal(2); // Approved
      expect(processedTime).to.be.gt(0);
    });

    /**
     * @notice Should reject approval from unauthorized users
     */
    it("Should reject approval from unauthorized user", async function () {
      await expect(
        privacyInsuranceClaims.connect(unauthorized).approveClaim(1)
      ).to.be.revertedWith("Not authorized reviewer");
    });

    /**
     * @notice Should only approve claims under review
     */
    it("Should only approve claims in under review status", async function () {
      await privacyInsuranceClaims.connect(reviewer1).approveClaim(1);

      await expect(
        privacyInsuranceClaims.connect(reviewer1).approveClaim(1)
      ).to.be.revertedWith("Claim not under review");
    });
  });

  /**
   * @title Claim Rejection Tests
   * @notice Tests for rejecting claims with reasons
   */
  describe("Claim Rejection", function () {
    beforeEach(async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);

      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(5000, 12345, 4500, 45, 6);

      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .addReviewer(reviewer1.address);

      await privacyInsuranceClaims.connect(reviewer1).reviewClaim(1);
    });

    /**
     * @notice Should reject claim with reason
     * @dev Provides transparency while maintaining data privacy
     */
    it("Should reject claim with reason", async function () {
      const rejectionReason = "Insufficient documentation provided";

      await expect(
        privacyInsuranceClaims.connect(reviewer1).rejectClaim(1, rejectionReason)
      )
        .to.emit(privacyInsuranceClaims, "ClaimRejected")
        .withArgs(1, policyHolder1.address, rejectionReason, await time.latest());

      const [, status, isProcessed] = await privacyInsuranceClaims.getClaimInfo(1);
      expect(status).to.equal(3); // Rejected
      expect(isProcessed).to.be.true;
    });
  });

  /**
   * @title Payment Processing Tests
   * @notice Tests for processing payments on approved claims
   */
  describe("Payment Processing", function () {
    beforeEach(async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);

      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(5000, 12345, 4500, 45, 6);

      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .addReviewer(reviewer1.address);

      await privacyInsuranceClaims.connect(reviewer1).reviewClaim(1);
      await privacyInsuranceClaims.connect(reviewer1).approveClaim(1);
    });

    /**
     * @notice Should process payment for approved claim
     * @dev Only insurance company can process payments
     */
    it("Should process payment for approved claim", async function () {
      await expect(
        privacyInsuranceClaims.connect(insuranceCompany).processPayment(1)
      )
        .to.emit(privacyInsuranceClaims, "PaymentProcessed")
        .withArgs(1, policyHolder1.address, await time.latest());

      const [, status, isProcessed] = await privacyInsuranceClaims.getClaimInfo(1);
      expect(status).to.equal(4); // Paid
      expect(isProcessed).to.be.true;
    });

    /**
     * @notice Should reject payment processing from non-insurance company
     */
    it("Should reject payment from non-insurance company", async function () {
      await expect(
        privacyInsuranceClaims.connect(reviewer1).processPayment(1)
      ).to.be.revertedWith("Not authorized insurance company");
    });

    /**
     * @notice Should only process payments for approved claims
     */
    it("Should only process payment for approved claims", async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(3000, 67890, 2800, 45, 4);

      await expect(
        privacyInsuranceClaims.connect(insuranceCompany).processPayment(2)
      ).to.be.revertedWith("Claim not approved");
    });
  });

  /**
   * @title Policy Management Tests
   * @notice Tests for activating and deactivating policies
   */
  describe("Policy Management", function () {
    beforeEach(async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);
    });

    /**
     * @notice Should deactivate policy
     * @dev Insurance company can deactivate policies
     */
    it("Should deactivate policy", async function () {
      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .deactivatePolicy(policyHolder1.address);

      const [isActive] = await privacyInsuranceClaims.getPolicyStatus(
        policyHolder1.address
      );
      expect(isActive).to.be.false;
    });

    /**
     * @notice Should reactivate policy
     * @dev Insurance company can reactivate deactivated policies
     */
    it("Should reactivate policy", async function () {
      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .deactivatePolicy(policyHolder1.address);

      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .reactivatePolicy(policyHolder1.address);

      const [isActive] = await privacyInsuranceClaims.getPolicyStatus(
        policyHolder1.address
      );
      expect(isActive).to.be.true;
    });

    /**
     * @notice Should reject claim submission with deactivated policy
     * @dev Deactivated policies cannot submit new claims
     */
    it("Should prevent claim submission with deactivated policy", async function () {
      await privacyInsuranceClaims
        .connect(insuranceCompany)
        .deactivatePolicy(policyHolder1.address);

      await expect(
        privacyInsuranceClaims
          .connect(policyHolder1)
          .submitClaim(5000, 12345, 4500, 45, 6)
      ).to.be.revertedWith("No active policy");
    });
  });

  /**
   * @title System Statistics Tests
   * @notice Tests for retrieving system-wide statistics
   */
  describe("System Statistics", function () {
    /**
     * @notice Should track system statistics correctly
     * @dev Verifies totalClaims and nextClaimId tracking
     */
    it("Should track total claims correctly", async function () {
      await privacyInsuranceClaims
        .connect(policyHolder1)
        .createPolicy(500, 100000);

      await privacyInsuranceClaims
        .connect(policyHolder2)
        .createPolicy(600, 150000);

      await privacyInsuranceClaims
        .connect(policyHolder1)
        .submitClaim(5000, 12345, 4500, 45, 6);

      await privacyInsuranceClaims
        .connect(policyHolder2)
        .submitClaim(7000, 67890, 6500, 52, 7);

      const [totalClaims, nextClaimId] =
        await privacyInsuranceClaims.getSystemStats();
      expect(totalClaims).to.equal(2);
      expect(nextClaimId).to.equal(3);
    });
  });

  /**
   * @title Edge Cases and Security Tests
   * @notice Tests for edge cases and security considerations
   */
  describe("Edge Cases", function () {
    /**
     * @notice Should reject operations on invalid claim IDs
     */
    it("Should reject invalid claim ID", async function () {
      await expect(
        privacyInsuranceClaims.getClaimInfo(999)
      ).to.be.revertedWith("Invalid claim ID");
    });

    /**
     * @notice Should handle empty claims list correctly
     */
    it("Should return empty array for user with no claims", async function () {
      const userClaims = await privacyInsuranceClaims.getUserClaims(
        unauthorized.address
      );
      expect(userClaims.length).to.equal(0);
    });

    /**
     * @notice Should handle zero address validation
     */
    it("Should reject zero address for reviewer", async function () {
      await expect(
        privacyInsuranceClaims
          .connect(insuranceCompany)
          .addReviewer(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid reviewer address");
    });
  });
});
