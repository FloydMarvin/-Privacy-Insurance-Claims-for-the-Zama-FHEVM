// Privacy Insurance Claims - Smart Contract Interface
// Contract ABI for the Privacy Insurance Claims system
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint32", "name": "claimId", "type": "uint32"},
            {"indexed": true, "internalType": "address", "name": "claimant", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "ClaimApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint32", "name": "claimId", "type": "uint32"},
            {"indexed": true, "internalType": "address", "name": "claimant", "type": "address"},
            {"indexed": false, "internalType": "string", "name": "reason", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "ClaimRejected",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint32", "name": "claimId", "type": "uint32"},
            {"indexed": false, "internalType": "enum PrivacyInsuranceClaims.ClaimStatus", "name": "newStatus", "type": "uint8"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "ClaimStatusUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint32", "name": "claimId", "type": "uint32"},
            {"indexed": true, "internalType": "address", "name": "claimant", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "ClaimSubmitted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint32", "name": "claimId", "type": "uint32"},
            {"indexed": true, "internalType": "address", "name": "claimant", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "PaymentProcessed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "holder", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "PolicyCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "reviewer", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "ReviewerAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "address", "name": "reviewer", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "ReviewerRemoved",
        "type": "event"
    },
    {
        "inputs": [{"internalType": "address", "name": "_reviewer", "type": "address"}],
        "name": "addReviewer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint32", "name": "_claimId", "type": "uint32"}],
        "name": "approveClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "authorizedReviewers",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
        "name": "claims",
        "outputs": [
            {"internalType": "address", "name": "claimant", "type": "address"},
            {"internalType": "euint64", "name": "encryptedClaimAmount", "type": "uint256"},
            {"internalType": "euint32", "name": "encryptedSeverity", "type": "uint256"},
            {"internalType": "enum PrivacyInsuranceClaims.ClaimStatus", "name": "status", "type": "uint8"},
            {"internalType": "bool", "name": "isProcessed", "type": "bool"},
            {"internalType": "uint256", "name": "submissionTime", "type": "uint256"},
            {"internalType": "uint256", "name": "processedTime", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint32", "name": "_monthlyPremium", "type": "uint32"},
            {"internalType": "uint32", "name": "_coverageLimit", "type": "uint32"}
        ],
        "name": "createPolicy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_holder", "type": "address"}],
        "name": "deactivatePolicy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint32", "name": "_claimId", "type": "uint32"}],
        "name": "getClaimInfo",
        "outputs": [
            {"internalType": "address", "name": "claimant", "type": "address"},
            {"internalType": "enum PrivacyInsuranceClaims.ClaimStatus", "name": "status", "type": "uint8"},
            {"internalType": "bool", "name": "isProcessed", "type": "bool"},
            {"internalType": "uint256", "name": "submissionTime", "type": "uint256"},
            {"internalType": "uint256", "name": "processedTime", "type": "uint256"},
            {"internalType": "uint256", "name": "reviewerCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_holder", "type": "address"}],
        "name": "getPolicyStatus",
        "outputs": [
            {"internalType": "bool", "name": "isActive", "type": "bool"},
            {"internalType": "uint256", "name": "policyStartDate", "type": "uint256"},
            {"internalType": "uint256", "name": "claimCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSystemStats",
        "outputs": [
            {"internalType": "uint256", "name": "totalClaims_", "type": "uint256"},
            {"internalType": "uint32", "name": "nextClaimId_", "type": "uint32"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "getUserClaims",
        "outputs": [{"internalType": "uint32[]", "name": "", "type": "uint32[]"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "insuranceCompany",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_reviewer", "type": "address"}],
        "name": "isAuthorizedReviewer",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
        "name": "medicalRecords",
        "outputs": [
            {"internalType": "euint32", "name": "encryptedDiagnosis", "type": "uint256"},
            {"internalType": "euint32", "name": "encryptedTreatmentCost", "type": "uint256"},
            {"internalType": "euint32", "name": "encryptedAge", "type": "uint256"},
            {"internalType": "bool", "name": "hasRecord", "type": "bool"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextClaimId",
        "outputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "policyHolders",
        "outputs": [
            {"internalType": "bool", "name": "isActive", "type": "bool"},
            {"internalType": "euint32", "name": "encryptedPremium", "type": "uint256"},
            {"internalType": "euint32", "name": "encryptedCoverage", "type": "uint256"},
            {"internalType": "uint256", "name": "policyStartDate", "type": "uint256"},
            {"internalType": "uint256", "name": "claimCount", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint32", "name": "_claimId", "type": "uint32"}],
        "name": "processPayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_holder", "type": "address"}],
        "name": "reactivatePolicy",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint32", "name": "_claimId", "type": "uint32"},
            {"internalType": "string", "name": "_reason", "type": "string"}
        ],
        "name": "rejectClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_reviewer", "type": "address"}],
        "name": "removeReviewer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint32", "name": "_claimId", "type": "uint32"}],
        "name": "reviewClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint64", "name": "_claimAmount", "type": "uint64"},
            {"internalType": "uint32", "name": "_diagnosisCode", "type": "uint32"},
            {"internalType": "uint32", "name": "_treatmentCost", "type": "uint32"},
            {"internalType": "uint32", "name": "_patientAge", "type": "uint32"},
            {"internalType": "uint32", "name": "_severityLevel", "type": "uint32"}
        ],
        "name": "submitClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalClaims",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}, {"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "userClaims",
        "outputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// Contract configuration - Update with your deployed contract address
const CONTRACT_ADDRESS = "0x18C969eBe12c62c18B896CA4D844E1433A904Be9"; // Replace with your deployed contract address
const SEPOLIA_CHAIN_ID = 0xaa36a7; // Sepolia testnet chain ID

// Global variables
let provider = null;
let signer = null;
let contract = null;
let userAccount = null;

// Status mappings
const CLAIM_STATUS = {
    0: 'Submitted',
    1: 'Under Review',
    2: 'Approved',
    3: 'Rejected',
    4: 'Paid'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Application initialization
async function initializeApp() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Check if already connected
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }

            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    } else {
        showError('MetaMask is not installed. Please install MetaMask to use this application.');
    }
}

// Connect to MetaMask wallet
async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];

        // Initialize provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        // Check and switch to Zama Sepolia network
        await checkAndSwitchNetwork();

        // Initialize contract (if address is set)
        if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x...") {
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            await loadContractInfo();
        }

        // Update UI
        updateWalletUI();
        await loadPolicyStatus();

        showSuccess('Wallet connected successfully!');
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showError('Failed to connect wallet: ' + error.message);
    }
}

// Check and switch to Sepolia network
async function checkAndSwitchNetwork() {
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== '0xaa36a7') { // Sepolia chain ID
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0xaa36a7',
                            chainName: 'Sepolia Test Network',
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                        }],
                    });
                } else {
                    throw switchError;
                }
            }
        }
    } catch (error) {
        console.error('Error switching network:', error);
        showError('Failed to switch to Sepolia network: ' + error.message);
    }
}

// Load contract information
async function loadContractInfo() {
    try {
        if (!contract) return;

        const insuranceCompany = await contract.insuranceCompany();

        document.getElementById('contractAddress').textContent = CONTRACT_ADDRESS;
        document.getElementById('insuranceCompany').textContent = insuranceCompany;
        document.getElementById('contractInfo').style.display = 'block';
    } catch (error) {
        console.error('Error loading contract info:', error);
    }
}

// Update wallet UI
function updateWalletUI() {
    const walletStatus = document.getElementById('walletStatus');
    const walletAddress = document.getElementById('walletAddress');
    const connectButton = document.getElementById('connectWallet');

    if (userAccount) {
        walletStatus.textContent = 'Connected';
        walletStatus.style.color = '#28a745';
        walletAddress.textContent = userAccount;
        walletAddress.style.display = 'inline';
        connectButton.textContent = 'Connected';
        connectButton.disabled = true;
        connectButton.style.background = '#28a745';
    } else {
        walletStatus.textContent = 'Not Connected';
        walletStatus.style.color = '#dc3545';
        walletAddress.style.display = 'none';
        connectButton.textContent = 'Connect MetaMask';
        connectButton.disabled = false;
        connectButton.style.background = '#4CAF50';
    }
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        userAccount = null;
        provider = null;
        signer = null;
        contract = null;
        updateWalletUI();
        showError('Please connect to MetaMask');
    } else {
        userAccount = accounts[0];
        connectWallet();
    }
}

// Handle chain changes
function handleChainChanged(chainId) {
    window.location.reload();
}

// Create insurance policy
async function createPolicy() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const monthlyPremium = document.getElementById('monthlyPremium').value;
        const coverageLimit = document.getElementById('coverageLimit').value;

        if (!monthlyPremium || !coverageLimit) {
            showError('Please fill in all fields');
            return;
        }

        if (parseInt(monthlyPremium) <= 0 || parseInt(coverageLimit) <= 0) {
            showError('Premium and coverage must be greater than 0');
            return;
        }

        showLoading('Creating policy...');

        const tx = await contract.createPolicy(
            parseInt(monthlyPremium),
            parseInt(coverageLimit)
        );

        await tx.wait();
        showSuccess('Policy created successfully!');

        // Clear form
        document.getElementById('monthlyPremium').value = '';
        document.getElementById('coverageLimit').value = '';

        // Reload policy status
        await loadPolicyStatus();
    } catch (error) {
        console.error('Error creating policy:', error);
        showError('Failed to create policy: ' + error.message);
    }
}

// Load policy status
async function loadPolicyStatus() {
    try {
        if (!contract || !userAccount) {
            document.getElementById('policyStatus').innerHTML = '<div class="error">Please connect wallet and set contract address</div>';
            return;
        }

        const policyStatus = await contract.getPolicyStatus(userAccount);
        const [isActive, policyStartDate, claimCount] = policyStatus;

        if (isActive) {
            document.getElementById('createPolicyForm').style.display = 'none';
            document.getElementById('policyInfo').style.display = 'block';
            document.getElementById('policyActive').textContent = 'Active';
            document.getElementById('policyStartDate').textContent = new Date(policyStartDate * 1000).toLocaleDateString();
            document.getElementById('totalUserClaims').textContent = claimCount.toString();
            document.getElementById('policyStatus').innerHTML = '<div class="success">✅ You have an active insurance policy</div>';
        } else {
            document.getElementById('createPolicyForm').style.display = 'block';
            document.getElementById('policyInfo').style.display = 'none';
            document.getElementById('policyStatus').innerHTML = '<div class="info-box">ℹ️ You don\'t have an active policy. Create one to submit claims.</div>';
        }
    } catch (error) {
        console.error('Error loading policy status:', error);
        document.getElementById('policyStatus').innerHTML = '<div class="error">Error loading policy status</div>';
    }
}

// Submit insurance claim
async function submitClaim() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const claimAmount = document.getElementById('claimAmount').value;
        const diagnosisCode = document.getElementById('diagnosisCode').value;
        const treatmentCost = document.getElementById('treatmentCost').value;
        const patientAge = document.getElementById('patientAge').value;
        const severityLevel = document.getElementById('severityLevel').value;

        if (!claimAmount || !diagnosisCode || !treatmentCost || !patientAge || !severityLevel) {
            showError('Please fill in all fields');
            return;
        }

        if (parseInt(patientAge) < 1 || parseInt(patientAge) > 120) {
            showError('Patient age must be between 1 and 120');
            return;
        }

        if (parseInt(severityLevel) < 1 || parseInt(severityLevel) > 10) {
            showError('Severity level must be between 1 and 10');
            return;
        }

        showLoading('Submitting encrypted claim...');

        const tx = await contract.submitClaim(
            parseInt(claimAmount),
            parseInt(diagnosisCode),
            parseInt(treatmentCost),
            parseInt(patientAge),
            parseInt(severityLevel)
        );

        await tx.wait();
        showSuccess('Claim submitted successfully with encrypted data!');

        // Clear form
        document.getElementById('claimAmount').value = '';
        document.getElementById('diagnosisCode').value = '';
        document.getElementById('treatmentCost').value = '';
        document.getElementById('patientAge').value = '';
        document.getElementById('severityLevel').value = '';

    } catch (error) {
        console.error('Error submitting claim:', error);
        showError('Failed to submit claim: ' + error.message);
    }
}

// Review claim
async function reviewClaim() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const claimId = document.getElementById('claimId').value;

        if (!claimId) {
            showError('Please enter a claim ID');
            return;
        }

        showLoading('Reviewing claim...');

        const tx = await contract.reviewClaim(parseInt(claimId));
        await tx.wait();

        showSuccess('Claim marked for review successfully!');
    } catch (error) {
        console.error('Error reviewing claim:', error);
        showError('Failed to review claim: ' + error.message);
    }
}

// Approve claim
async function approveClaim() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const claimId = document.getElementById('claimId').value;

        if (!claimId) {
            showError('Please enter a claim ID');
            return;
        }

        showLoading('Approving claim...');

        const tx = await contract.approveClaim(parseInt(claimId));
        await tx.wait();

        showSuccess('Claim approved successfully!');
    } catch (error) {
        console.error('Error approving claim:', error);
        showError('Failed to approve claim: ' + error.message);
    }
}

// Reject claim
async function rejectClaim() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const claimId = document.getElementById('claimId').value;
        const reason = document.getElementById('rejectReason').value;

        if (!claimId || !reason) {
            showError('Please enter claim ID and rejection reason');
            return;
        }

        showLoading('Rejecting claim...');

        const tx = await contract.rejectClaim(parseInt(claimId), reason);
        await tx.wait();

        showSuccess('Claim rejected successfully!');
        document.getElementById('rejectReason').value = '';
    } catch (error) {
        console.error('Error rejecting claim:', error);
        showError('Failed to reject claim: ' + error.message);
    }
}

// Process payment
async function processPayment() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const claimId = document.getElementById('claimId').value;

        if (!claimId) {
            showError('Please enter a claim ID');
            return;
        }

        showLoading('Processing payment...');

        const tx = await contract.processPayment(parseInt(claimId));
        await tx.wait();

        showSuccess('Payment processed successfully!');
    } catch (error) {
        console.error('Error processing payment:', error);
        showError('Failed to process payment: ' + error.message);
    }
}

// Get claim information
async function getClaimInfo() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const claimId = document.getElementById('claimId').value;

        if (!claimId) {
            showError('Please enter a claim ID');
            return;
        }

        const claimInfo = await contract.getClaimInfo(parseInt(claimId));
        const [claimant, status, isProcessed, submissionTime, processedTime, reviewerCount] = claimInfo;

        const info = `
            <div class="claim-item">
                <div class="claim-header">
                    <span class="claim-id">Claim #${claimId}</span>
                    <span class="status-badge status-${CLAIM_STATUS[status].toLowerCase().replace(' ', '')}">${CLAIM_STATUS[status]}</span>
                </div>
                <div class="claim-details">
                    <p><strong>Claimant:</strong> ${claimant}</p>
                    <p><strong>Submitted:</strong> ${new Date(submissionTime * 1000).toLocaleString()}</p>
                    <p><strong>Processed:</strong> ${processedTime > 0 ? new Date(processedTime * 1000).toLocaleString() : 'Not processed'}</p>
                    <p><strong>Reviewers:</strong> ${reviewerCount}</p>
                    <p><strong>Is Processed:</strong> ${isProcessed ? 'Yes' : 'No'}</p>
                </div>
            </div>
        `;

        showSuccess('Claim information retrieved:');
        const claimsList = document.getElementById('claimsList');
        claimsList.innerHTML = info;
    } catch (error) {
        console.error('Error getting claim info:', error);
        showError('Failed to get claim info: ' + error.message);
    }
}

// Add reviewer
async function addReviewer() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const reviewerAddress = document.getElementById('reviewerAddress').value;

        if (!reviewerAddress || !ethers.utils.isAddress(reviewerAddress)) {
            showError('Please enter a valid reviewer address');
            return;
        }

        showLoading('Adding reviewer...');

        const tx = await contract.addReviewer(reviewerAddress);
        await tx.wait();

        showSuccess('Reviewer added successfully!');
        document.getElementById('reviewerAddress').value = '';
    } catch (error) {
        console.error('Error adding reviewer:', error);
        showError('Failed to add reviewer: ' + error.message);
    }
}

// Remove reviewer
async function removeReviewer() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const reviewerAddress = document.getElementById('reviewerAddress').value;

        if (!reviewerAddress || !ethers.utils.isAddress(reviewerAddress)) {
            showError('Please enter a valid reviewer address');
            return;
        }

        showLoading('Removing reviewer...');

        const tx = await contract.removeReviewer(reviewerAddress);
        await tx.wait();

        showSuccess('Reviewer removed successfully!');
        document.getElementById('reviewerAddress').value = '';
    } catch (error) {
        console.error('Error removing reviewer:', error);
        showError('Failed to remove reviewer: ' + error.message);
    }
}

// Check reviewer status
async function checkReviewerStatus() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const reviewerAddress = document.getElementById('reviewerAddress').value;

        if (!reviewerAddress || !ethers.utils.isAddress(reviewerAddress)) {
            showError('Please enter a valid reviewer address');
            return;
        }

        const isAuthorized = await contract.isAuthorizedReviewer(reviewerAddress);

        if (isAuthorized) {
            showSuccess('✅ This address is an authorized reviewer');
        } else {
            showError('❌ This address is not an authorized reviewer');
        }
    } catch (error) {
        console.error('Error checking reviewer status:', error);
        showError('Failed to check reviewer status: ' + error.message);
    }
}

// Load user claims
async function loadUserClaims() {
    try {
        if (!contract || !userAccount) {
            showError('Please connect wallet and set contract address');
            return;
        }

        showLoading('Loading your claims...');

        const userClaims = await contract.getUserClaims(userAccount);
        const claimsList = document.getElementById('claimsList');

        if (userClaims.length === 0) {
            claimsList.innerHTML = '<div class="loading">No claims found for your account</div>';
            return;
        }

        let claimsHtml = '';
        for (const claimId of userClaims) {
            try {
                const claimInfo = await contract.getClaimInfo(claimId);
                const [claimant, status, isProcessed, submissionTime, processedTime, reviewerCount] = claimInfo;

                claimsHtml += `
                    <div class="claim-item">
                        <div class="claim-header">
                            <span class="claim-id">Claim #${claimId}</span>
                            <span class="status-badge status-${CLAIM_STATUS[status].toLowerCase().replace(' ', '')}">${CLAIM_STATUS[status]}</span>
                        </div>
                        <div class="claim-details">
                            <p><strong>Submitted:</strong> ${new Date(submissionTime * 1000).toLocaleString()}</p>
                            <p><strong>Processed:</strong> ${processedTime > 0 ? new Date(processedTime * 1000).toLocaleString() : 'Not processed'}</p>
                            <p><strong>Reviewers:</strong> ${reviewerCount}</p>
                            <p><strong>Status:</strong> ${isProcessed ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading claim ${claimId}:`, error);
            }
        }

        claimsList.innerHTML = claimsHtml || '<div class="loading">Error loading claims</div>';
    } catch (error) {
        console.error('Error loading user claims:', error);
        showError('Failed to load claims: ' + error.message);
    }
}

// Load system statistics
async function loadSystemStats() {
    try {
        if (!contract) {
            showError('Contract not initialized. Please set CONTRACT_ADDRESS.');
            return;
        }

        const stats = await contract.getSystemStats();
        const [totalClaims, nextClaimId] = stats;

        document.getElementById('totalSystemClaims').textContent = totalClaims.toString();
        document.getElementById('nextClaimId').textContent = nextClaimId.toString();

        showSuccess('Statistics updated!');
    } catch (error) {
        console.error('Error loading system stats:', error);
        showError('Failed to load statistics: ' + error.message);
    }
}

// Utility functions
function showError(message) {
    removeExistingAlerts();
    const alert = document.createElement('div');
    alert.className = 'error';
    alert.textContent = message;
    document.querySelector('.container').insertBefore(alert, document.querySelector('.main-content'));
    setTimeout(() => alert.remove(), 5000);
}

function showSuccess(message) {
    removeExistingAlerts();
    const alert = document.createElement('div');
    alert.className = 'success';
    alert.textContent = message;
    document.querySelector('.container').insertBefore(alert, document.querySelector('.main-content'));
    setTimeout(() => alert.remove(), 5000);
}

function showLoading(message) {
    removeExistingAlerts();
    const alert = document.createElement('div');
    alert.className = 'info-box';
    alert.innerHTML = `<div style="text-align: center;">⏳ ${message}</div>`;
    document.querySelector('.container').insertBefore(alert, document.querySelector('.main-content'));
}

function removeExistingAlerts() {
    document.querySelectorAll('.error, .success, .info-box').forEach(alert => {
        if (alert.textContent.includes('⏳') || alert.textContent.includes('Error') || alert.textContent.includes('Success')) {
            alert.remove();
        }
    });
}

// Connect wallet button event
document.getElementById('connectWallet').addEventListener('click', connectWallet);