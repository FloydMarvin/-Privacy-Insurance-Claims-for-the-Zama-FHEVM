// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivacyInsuranceClaims is SepoliaConfig {

    address public insuranceCompany;
    uint32 public nextClaimId;
    uint256 public totalClaims;

    // Claim status enum
    enum ClaimStatus {
        Submitted,      // 0 - Initial submission
        UnderReview,    // 1 - Being reviewed
        Approved,       // 2 - Approved for payout
        Rejected,       // 3 - Rejected
        Paid           // 4 - Payment completed
    }

    struct MedicalRecord {
        euint32 encryptedDiagnosis;     // Encrypted diagnosis code
        euint32 encryptedTreatmentCost; // Encrypted treatment cost
        euint32 encryptedAge;           // Encrypted patient age
        bool hasRecord;
        uint256 timestamp;
    }

    struct InsuranceClaim {
        address claimant;
        euint64 encryptedClaimAmount;   // Encrypted claim amount
        euint32 encryptedSeverity;      // Encrypted medical severity (1-10)
        ClaimStatus status;
        bool isProcessed;
        uint256 submissionTime;
        uint256 processedTime;
        address[] reviewers;
    }

    struct PolicyHolder {
        bool isActive;
        euint32 encryptedPremium;       // Encrypted monthly premium
        euint32 encryptedCoverage;      // Encrypted coverage limit
        uint256 policyStartDate;
        uint256 claimCount;
    }

    mapping(uint32 => InsuranceClaim) public claims;
    mapping(uint32 => MedicalRecord) public medicalRecords;
    mapping(address => PolicyHolder) public policyHolders;
    mapping(address => bool) public authorizedReviewers;
    mapping(address => uint32[]) public userClaims;

    event PolicyCreated(address indexed holder, uint256 timestamp);
    event ClaimSubmitted(uint32 indexed claimId, address indexed claimant, uint256 timestamp);
    event ClaimStatusUpdated(uint32 indexed claimId, ClaimStatus newStatus, uint256 timestamp);
    event ClaimApproved(uint32 indexed claimId, address indexed claimant, uint256 timestamp);
    event ClaimRejected(uint32 indexed claimId, address indexed claimant, string reason, uint256 timestamp);
    event PaymentProcessed(uint32 indexed claimId, address indexed claimant, uint256 timestamp);
    event ReviewerAdded(address indexed reviewer, uint256 timestamp);
    event ReviewerRemoved(address indexed reviewer, uint256 timestamp);

    modifier onlyInsuranceCompany() {
        require(msg.sender == insuranceCompany, "Not authorized insurance company");
        _;
    }

    modifier onlyAuthorizedReviewer() {
        require(authorizedReviewers[msg.sender] || msg.sender == insuranceCompany, "Not authorized reviewer");
        _;
    }

    modifier onlyActivePolicyHolder() {
        require(policyHolders[msg.sender].isActive, "No active policy");
        _;
    }

    modifier validClaimId(uint32 _claimId) {
        require(_claimId > 0 && _claimId <= nextClaimId, "Invalid claim ID");
        _;
    }

    constructor() {
        insuranceCompany = msg.sender;
        nextClaimId = 1;
        totalClaims = 0;
        authorizedReviewers[msg.sender] = true;
    }

    // Create insurance policy with encrypted details
    function createPolicy(
        uint32 _monthlyPremium,
        uint32 _coverageLimit
    ) external {
        require(!policyHolders[msg.sender].isActive, "Policy already exists");
        require(_monthlyPremium > 0, "Premium must be greater than 0");
        require(_coverageLimit > 0, "Coverage must be greater than 0");

        // Encrypt sensitive policy data
        euint32 encryptedPremium = FHE.asEuint32(_monthlyPremium);
        euint32 encryptedCoverage = FHE.asEuint32(_coverageLimit);

        policyHolders[msg.sender] = PolicyHolder({
            isActive: true,
            encryptedPremium: encryptedPremium,
            encryptedCoverage: encryptedCoverage,
            policyStartDate: block.timestamp,
            claimCount: 0
        });

        // Grant access permissions
        FHE.allowThis(encryptedPremium);
        FHE.allowThis(encryptedCoverage);
        FHE.allow(encryptedPremium, msg.sender);
        FHE.allow(encryptedCoverage, msg.sender);

        emit PolicyCreated(msg.sender, block.timestamp);
    }

    // Submit medical insurance claim with encrypted medical data
    function submitClaim(
        uint64 _claimAmount,
        uint32 _diagnosisCode,
        uint32 _treatmentCost,
        uint32 _patientAge,
        uint32 _severityLevel
    ) external onlyActivePolicyHolder {
        require(_claimAmount > 0, "Claim amount must be greater than 0");
        require(_severityLevel >= 1 && _severityLevel <= 10, "Severity must be 1-10");
        require(_patientAge >= 1 && _patientAge <= 120, "Invalid age");

        uint32 claimId = nextClaimId++;

        // Encrypt all sensitive medical and financial data
        euint64 encryptedClaimAmount = FHE.asEuint64(_claimAmount);
        euint32 encryptedDiagnosis = FHE.asEuint32(_diagnosisCode);
        euint32 encryptedTreatmentCost = FHE.asEuint32(_treatmentCost);
        euint32 encryptedAge = FHE.asEuint32(_patientAge);
        euint32 encryptedSeverity = FHE.asEuint32(_severityLevel);

        // Create claim record
        claims[claimId] = InsuranceClaim({
            claimant: msg.sender,
            encryptedClaimAmount: encryptedClaimAmount,
            encryptedSeverity: encryptedSeverity,
            status: ClaimStatus.Submitted,
            isProcessed: false,
            submissionTime: block.timestamp,
            processedTime: 0,
            reviewers: new address[](0)
        });

        // Create medical record
        medicalRecords[claimId] = MedicalRecord({
            encryptedDiagnosis: encryptedDiagnosis,
            encryptedTreatmentCost: encryptedTreatmentCost,
            encryptedAge: encryptedAge,
            hasRecord: true,
            timestamp: block.timestamp
        });

        // Update user's claim history
        userClaims[msg.sender].push(claimId);
        policyHolders[msg.sender].claimCount++;
        totalClaims++;

        // Grant necessary access permissions
        FHE.allowThis(encryptedClaimAmount);
        FHE.allowThis(encryptedDiagnosis);
        FHE.allowThis(encryptedTreatmentCost);
        FHE.allowThis(encryptedAge);
        FHE.allowThis(encryptedSeverity);

        FHE.allow(encryptedClaimAmount, msg.sender);
        FHE.allow(encryptedDiagnosis, msg.sender);
        FHE.allow(encryptedTreatmentCost, msg.sender);
        FHE.allow(encryptedAge, msg.sender);
        FHE.allow(encryptedSeverity, msg.sender);

        emit ClaimSubmitted(claimId, msg.sender, block.timestamp);
    }

    // Review claim - only authorized reviewers can access encrypted data
    function reviewClaim(uint32 _claimId) external onlyAuthorizedReviewer validClaimId(_claimId) {
        InsuranceClaim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Submitted, "Claim not in submitted status");

        // Add reviewer to the claim
        claim.reviewers.push(msg.sender);
        claim.status = ClaimStatus.UnderReview;

        // Grant reviewer access to encrypted data for evaluation
        FHE.allow(claim.encryptedClaimAmount, msg.sender);
        FHE.allow(claim.encryptedSeverity, msg.sender);

        MedicalRecord storage record = medicalRecords[_claimId];
        FHE.allow(record.encryptedDiagnosis, msg.sender);
        FHE.allow(record.encryptedTreatmentCost, msg.sender);
        FHE.allow(record.encryptedAge, msg.sender);

        emit ClaimStatusUpdated(_claimId, ClaimStatus.UnderReview, block.timestamp);
    }

    // Approve claim after review
    function approveClaim(uint32 _claimId) external onlyAuthorizedReviewer validClaimId(_claimId) {
        InsuranceClaim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.UnderReview, "Claim not under review");

        claim.status = ClaimStatus.Approved;
        claim.processedTime = block.timestamp;

        emit ClaimStatusUpdated(_claimId, ClaimStatus.Approved, block.timestamp);
        emit ClaimApproved(_claimId, claim.claimant, block.timestamp);
    }

    // Reject claim with reason
    function rejectClaim(uint32 _claimId, string memory _reason) external onlyAuthorizedReviewer validClaimId(_claimId) {
        InsuranceClaim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.UnderReview, "Claim not under review");

        claim.status = ClaimStatus.Rejected;
        claim.isProcessed = true;
        claim.processedTime = block.timestamp;

        emit ClaimStatusUpdated(_claimId, ClaimStatus.Rejected, block.timestamp);
        emit ClaimRejected(_claimId, claim.claimant, _reason, block.timestamp);
    }

    // Process payment for approved claims
    function processPayment(uint32 _claimId) external onlyInsuranceCompany validClaimId(_claimId) {
        InsuranceClaim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Approved, "Claim not approved");

        claim.status = ClaimStatus.Paid;
        claim.isProcessed = true;

        emit ClaimStatusUpdated(_claimId, ClaimStatus.Paid, block.timestamp);
        emit PaymentProcessed(_claimId, claim.claimant, block.timestamp);

        // In a real implementation, actual payment would be processed here
        // This could integrate with payment systems or transfer tokens/ETH
    }

    // Add authorized medical reviewer
    function addReviewer(address _reviewer) external onlyInsuranceCompany {
        require(_reviewer != address(0), "Invalid reviewer address");
        require(!authorizedReviewers[_reviewer], "Already authorized");

        authorizedReviewers[_reviewer] = true;
        emit ReviewerAdded(_reviewer, block.timestamp);
    }

    // Remove authorized reviewer
    function removeReviewer(address _reviewer) external onlyInsuranceCompany {
        require(authorizedReviewers[_reviewer], "Not authorized");
        require(_reviewer != insuranceCompany, "Cannot remove company");

        authorizedReviewers[_reviewer] = false;
        emit ReviewerRemoved(_reviewer, block.timestamp);
    }

    // Get claim information (public data only)
    function getClaimInfo(uint32 _claimId) external view validClaimId(_claimId) returns (
        address claimant,
        ClaimStatus status,
        bool isProcessed,
        uint256 submissionTime,
        uint256 processedTime,
        uint256 reviewerCount
    ) {
        InsuranceClaim storage claim = claims[_claimId];
        return (
            claim.claimant,
            claim.status,
            claim.isProcessed,
            claim.submissionTime,
            claim.processedTime,
            claim.reviewers.length
        );
    }

    // Get user's claim history
    function getUserClaims(address _user) external view returns (uint32[] memory) {
        return userClaims[_user];
    }

    // Get policy status
    function getPolicyStatus(address _holder) external view returns (
        bool isActive,
        uint256 policyStartDate,
        uint256 claimCount
    ) {
        PolicyHolder storage policy = policyHolders[_holder];
        return (
            policy.isActive,
            policy.policyStartDate,
            policy.claimCount
        );
    }

    // Check if address is authorized reviewer
    function isAuthorizedReviewer(address _reviewer) external view returns (bool) {
        return authorizedReviewers[_reviewer];
    }

    // Get total system statistics
    function getSystemStats() external view returns (
        uint256 totalClaims_,
        uint32 nextClaimId_
    ) {
        return (totalClaims, nextClaimId);
    }

    // Emergency functions for policy management
    function deactivatePolicy(address _holder) external onlyInsuranceCompany {
        require(policyHolders[_holder].isActive, "Policy not active");
        policyHolders[_holder].isActive = false;
    }

    function reactivatePolicy(address _holder) external onlyInsuranceCompany {
        require(!policyHolders[_holder].isActive, "Policy already active");
        policyHolders[_holder].isActive = true;
    }
}