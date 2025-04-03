// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FaidaInvestment is ReentrancyGuard, Ownable, Pausable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // Investment tier structure
    struct Tier {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 duration; // in days
        uint256 interestRate; // in basis points (1% = 100)
        string name;
        string description;
        bool isActive;
        uint256 totalInvestors;
        uint256 totalAmount;
        uint256 earlyWithdrawalPenalty; // in basis points (1% = 100)
    }

    // Investment structure
    struct Investment {
        uint256 id;
        uint256 amount;
        uint256 tierId;
        uint256 startTime;
        uint256 lastClaimTime;
        bool active;
        bool isLocked;
        uint256 claimedAmount;
        address referrer;
        uint256 referralRewards;
        uint256 lockEndTime;
    }

    // Referral structure
    struct ReferralInfo {
        address referrer;
        uint256 totalReferrals;
        uint256 totalRewards;
        uint256 activeReferrals;
        bool isActive;
    }

    // Analytics structure
    struct Analytics {
        uint256 totalVolume;
        uint256 dailyVolume;
        uint256 lastUpdateTime;
        uint256[] dailyVolumes;
        uint256[] dailyInvestors;
        uint256[] dailyRewards;
    }

    // State variables
    Counters.Counter private _investmentIds;
    mapping(uint256 => Tier) public tiers;
    mapping(address => Investment[]) public userInvestments;
    mapping(uint256 => address) public investmentOwner;
    mapping(address => ReferralInfo) public referralInfo;
    mapping(address => address) public userReferrer;
    mapping(bytes32 => bool) public referralCodes;
    mapping(address => bytes32) public userReferralCode;
    
    Analytics public analytics;
    uint256 public totalInvestors;
    uint256 public totalInvestment;
    uint256 public totalRewardsPaid;
    uint256 public minInvestmentAmount;
    uint256 public maxInvestmentAmount;
    uint256 public platformFee; // in basis points (1% = 100)
    uint256 public referralRewardRate; // in basis points (1% = 100)
    address public treasuryAddress;
    bool public emergencyMode;
    uint256 public constant DAY = 1 days;
    uint256 public constant MAX_LOCK_PERIOD = 365 days;

    // Events
    event InvestmentMade(
        address indexed investor,
        uint256 indexed investmentId,
        uint256 amount,
        uint256 tierId,
        address indexed referrer
    );
    event InvestmentWithdrawn(
        address indexed investor,
        uint256 indexed investmentId,
        uint256 amount,
        uint256 penalty
    );
    event RewardsClaimed(
        address indexed investor,
        uint256 indexed investmentId,
        uint256 amount
    );
    event ReferralRewardPaid(
        address indexed referrer,
        address indexed investor,
        uint256 amount
    );
    event InvestmentLocked(
        address indexed investor,
        uint256 indexed investmentId,
        uint256 lockPeriod
    );
    event InvestmentUnlocked(
        address indexed investor,
        uint256 indexed investmentId
    );
    event ReferralCodeGenerated(
        address indexed user,
        bytes32 referralCode
    );
    event TierAdded(
        uint256 indexed tierId,
        string name,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 duration,
        uint256 interestRate
    );
    event TierUpdated(
        uint256 indexed tierId,
        uint256 minAmount,
        uint256 maxAmount,
        uint256 duration,
        uint256 interestRate
    );
    event EmergencyModeActivated(bool status);
    event PlatformFeeUpdated(uint256 newFee);
    event TreasuryAddressUpdated(address newAddress);
    event ReferralRewardRateUpdated(uint256 newRate);

    // Modifiers
    modifier whenNotEmergency() {
        require(!emergencyMode, "Contract is in emergency mode");
        _;
    }

    modifier validTier(uint256 _tierId) {
        require(_tierId < 3, "Invalid tier ID");
        require(tiers[_tierId].isActive, "Tier is not active");
        _;
    }

    modifier investmentExists(uint256 _investmentId) {
        require(investmentOwner[_investmentId] != address(0), "Investment does not exist");
        _;
    }

    modifier isInvestmentOwner(uint256 _investmentId) {
        require(investmentOwner[_investmentId] == msg.sender, "Not investment owner");
        _;
    }

    modifier notLocked(uint256 _investmentId) {
        Investment memory investment = userInvestments[investmentOwner[_investmentId]][_investmentId - 1];
        require(block.timestamp >= investment.lockEndTime, "Investment is locked");
        _;
    }

    constructor() {
        // Initialize tiers with HBAR amounts (1 HBAR = 1e18 tinybars)
        tiers[0] = Tier({
            minAmount: 100 * 1e18, // 100 HBAR
            maxAmount: 1000 * 1e18, // 1000 HBAR
            duration: 30,
            interestRate: 500, // 5%
            name: "Starter",
            description: "Perfect for new investors",
            isActive: true,
            totalInvestors: 0,
            totalAmount: 0,
            earlyWithdrawalPenalty: 1000 // 10%
        });

        tiers[1] = Tier({
            minAmount: 1000 * 1e18, // 1000 HBAR
            maxAmount: 5000 * 1e18, // 5000 HBAR
            duration: 90,
            interestRate: 800, // 8%
            name: "Growth",
            description: "For growing your portfolio",
            isActive: true,
            totalInvestors: 0,
            totalAmount: 0,
            earlyWithdrawalPenalty: 1500 // 15%
        });

        tiers[2] = Tier({
            minAmount: 5000 * 1e18, // 5000 HBAR
            maxAmount: 20000 * 1e18, // 20000 HBAR
            duration: 180,
            interestRate: 1200, // 12%
            name: "Premium",
            description: "Maximum returns for serious investors",
            isActive: true,
            totalInvestors: 0,
            totalAmount: 0,
            earlyWithdrawalPenalty: 2000 // 20%
        });

        minInvestmentAmount = 100 * 1e18; // 100 HBAR
        maxInvestmentAmount = 20000 * 1e18; // 20000 HBAR
        platformFee = 100; // 1%
        referralRewardRate = 500; // 5%
        treasuryAddress = msg.sender;
        analytics.lastUpdateTime = block.timestamp;
    }

    function invest(uint256 _tierId, address _referrer) 
        external 
        payable 
        whenNotPaused 
        whenNotEmergency 
        validTier(_tierId) 
        nonReentrant 
    {
        require(msg.value >= tiers[_tierId].minAmount, "Investment amount too low");
        require(msg.value <= tiers[_tierId].maxAmount, "Investment amount too high");
        require(msg.value >= minInvestmentAmount, "Amount below minimum investment");
        require(msg.value <= maxInvestmentAmount, "Amount above maximum investment");
        require(_referrer != msg.sender, "Cannot refer yourself");
        require(_referrer == address(0) || referralInfo[_referrer].isActive, "Invalid referrer");

        _investmentIds.increment();
        uint256 newInvestmentId = _investmentIds.current();

        Investment memory newInvestment = Investment({
            id: newInvestmentId,
            amount: msg.value,
            tierId: _tierId,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            active: true,
            isLocked: true,
            claimedAmount: 0,
            referrer: _referrer,
            referralRewards: 0,
            lockEndTime: block.timestamp + (tiers[_tierId].duration * DAY)
        });

        userInvestments[msg.sender].push(newInvestment);
        investmentOwner[newInvestmentId] = msg.sender;

        // Update referral info
        if (_referrer != address(0)) {
            referralInfo[_referrer].totalReferrals++;
            referralInfo[_referrer].activeReferrals++;
            userReferrer[msg.sender] = _referrer;
        }

        // Update tier statistics
        tiers[_tierId].totalInvestors++;
        tiers[_tierId].totalAmount += msg.value;

        totalInvestors++;
        totalInvestment += msg.value;

        // Update analytics
        updateAnalytics(msg.value);

        // Calculate and transfer platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        (bool feeSuccess, ) = treasuryAddress.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        emit InvestmentMade(msg.sender, newInvestmentId, msg.value, _tierId, _referrer);
    }

    function generateReferralCode() external {
        require(userReferralCode[msg.sender] == bytes32(0), "Referral code already exists");
        
        bytes32 code = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        userReferralCode[msg.sender] = code;
        referralCodes[code] = true;
        referralInfo[msg.sender].isActive = true;
        
        emit ReferralCodeGenerated(msg.sender, code);
    }

    function lockInvestment(uint256 _investmentId, uint256 _lockPeriod) 
        external 
        whenNotPaused 
        whenNotEmergency 
        investmentExists(_investmentId) 
        isInvestmentOwner(_investmentId) 
        nonReentrant 
    {
        require(_lockPeriod <= MAX_LOCK_PERIOD, "Lock period too long");
        
        Investment storage investment = userInvestments[msg.sender][_investmentId - 1];
        require(investment.active, "Investment is not active");
        require(block.timestamp >= investment.lockEndTime, "Investment is already locked");
        
        investment.lockEndTime = block.timestamp + _lockPeriod;
        investment.isLocked = true;
        
        emit InvestmentLocked(msg.sender, _investmentId, _lockPeriod);
    }

    function unlockInvestment(uint256 _investmentId) 
        external 
        whenNotPaused 
        whenNotEmergency 
        investmentExists(_investmentId) 
        isInvestmentOwner(_investmentId) 
        nonReentrant 
    {
        Investment storage investment = userInvestments[msg.sender][_investmentId - 1];
        require(investment.active, "Investment is not active");
        require(investment.isLocked, "Investment is not locked");
        require(block.timestamp >= investment.lockEndTime, "Lock period not ended");
        
        investment.isLocked = false;
        
        emit InvestmentUnlocked(msg.sender, _investmentId);
    }

    function withdraw(uint256 _investmentId) 
        external 
        whenNotPaused 
        whenNotEmergency 
        investmentExists(_investmentId) 
        isInvestmentOwner(_investmentId) 
        nonReentrant 
        notLocked(_investmentId)
    {
        Investment storage investment = userInvestments[msg.sender][_investmentId - 1];
        require(investment.active, "Investment is not active");
        
        Tier memory tier = tiers[investment.tierId];
        uint256 endTime = investment.startTime + (tier.duration * DAY);
        
        uint256 pendingRewards = calculatePendingRewards(_investmentId);
        uint256 totalAmount = investment.amount + pendingRewards;
        
        uint256 penalty = 0;
        if (block.timestamp < endTime) {
            penalty = (totalAmount * tier.earlyWithdrawalPenalty) / 10000;
            totalAmount -= penalty;
        }

        investment.active = false;
        investment.isLocked = false;
        tiers[investment.tierId].totalInvestors--;
        tiers[investment.tierId].totalAmount -= investment.amount;
        totalInvestment -= investment.amount;
        totalRewardsPaid += pendingRewards;

        // Update referral info
        if (investment.referrer != address(0)) {
            referralInfo[investment.referrer].activeReferrals--;
        }

        (bool success, ) = msg.sender.call{value: totalAmount}("");
        require(success, "Transfer failed");

        emit InvestmentWithdrawn(msg.sender, _investmentId, totalAmount, penalty);
    }

    function updateAnalytics(uint256 _amount) internal {
        if (block.timestamp - analytics.lastUpdateTime >= DAY) {
            analytics.dailyVolumes.push(analytics.dailyVolume);
            analytics.dailyInvestors.push(totalInvestors);
            analytics.dailyRewards.push(totalRewardsPaid);
            analytics.dailyVolume = 0;
            analytics.lastUpdateTime = block.timestamp;
        }
        analytics.totalVolume += _amount;
        analytics.dailyVolume += _amount;
    }

    function getAnalytics() external view returns (
        uint256 totalVolume,
        uint256 dailyVolume,
        uint256[] memory dailyVolumes,
        uint256[] memory dailyInvestors,
        uint256[] memory dailyRewards
    ) {
        return (
            analytics.totalVolume,
            analytics.dailyVolume,
            analytics.dailyVolumes,
            analytics.dailyInvestors,
            analytics.dailyRewards
        );
    }

    function getReferralStats(address _user) external view returns (
        uint256 totalReferrals,
        uint256 activeReferrals,
        uint256 totalRewards
    ) {
        ReferralInfo memory info = referralInfo[_user];
        return (
            info.totalReferrals,
            info.activeReferrals,
            info.totalRewards
        );
    }

    function getInvestmentDetails(uint256 _investmentId) 
        external 
        view 
        investmentExists(_investmentId) 
        returns (
            uint256 amount,
            uint256 tierId,
            uint256 startTime,
            bool active,
            uint256 endTime,
            uint256 interestRate,
            uint256 claimedAmount,
            uint256 pendingRewards
        ) 
    {
        Investment memory investment = userInvestments[investmentOwner[_investmentId]][_investmentId - 1];
        Tier memory tier = tiers[investment.tierId];
        
        uint256 pendingRewards = calculatePendingRewards(_investmentId);
        
        return (
            investment.amount,
            investment.tierId,
            investment.startTime,
            investment.active,
            investment.startTime + (tier.duration * 1 days),
            tier.interestRate,
            investment.claimedAmount,
            pendingRewards
        );
    }

    function calculatePendingRewards(uint256 _investmentId) public view returns (uint256) {
        Investment memory investment = userInvestments[investmentOwner[_investmentId]][_investmentId - 1];
        Tier memory tier = tiers[investment.tierId];
        
        uint256 timeElapsed = block.timestamp - investment.lastClaimTime;
        uint256 dailyRate = (investment.amount * tier.interestRate) / (36500 * 100);
        return (dailyRate * timeElapsed) / 1 days;
    }

    function claimRewards(uint256 _investmentId) 
        external 
        whenNotPaused 
        whenNotEmergency 
        investmentExists(_investmentId) 
        isInvestmentOwner(_investmentId) 
        nonReentrant 
    {
        Investment storage investment = userInvestments[msg.sender][_investmentId - 1];
        require(investment.active, "Investment is not active");
        
        uint256 rewards = calculatePendingRewards(_investmentId);
        require(rewards > 0, "No rewards to claim");

        investment.lastClaimTime = block.timestamp;
        investment.claimedAmount += rewards;
        totalRewardsPaid += rewards;

        (bool success, ) = msg.sender.call{value: rewards}("");
        require(success, "Reward transfer failed");

        emit RewardsClaimed(msg.sender, _investmentId, rewards);
    }

    function addTier(
        uint256 _tierId,
        string memory _name,
        string memory _description,
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _duration,
        uint256 _interestRate
    ) external onlyOwner {
        require(_tierId >= 3, "Tier ID must be >= 3");
        
        tiers[_tierId] = Tier({
            minAmount: _minAmount,
            maxAmount: _maxAmount,
            duration: _duration,
            interestRate: _interestRate,
            name: _name,
            description: _description,
            isActive: true,
            totalInvestors: 0,
            totalAmount: 0,
            earlyWithdrawalPenalty: 0
        });

        emit TierAdded(_tierId, _name, _minAmount, _maxAmount, _duration, _interestRate);
    }

    function updateTier(
        uint256 _tierId,
        uint256 _minAmount,
        uint256 _maxAmount,
        uint256 _duration,
        uint256 _interestRate
    ) external onlyOwner validTier(_tierId) {
        tiers[_tierId].minAmount = _minAmount;
        tiers[_tierId].maxAmount = _maxAmount;
        tiers[_tierId].duration = _duration;
        tiers[_tierId].interestRate = _interestRate;

        emit TierUpdated(_tierId, _minAmount, _maxAmount, _duration, _interestRate);
    }

    function toggleTier(uint256 _tierId) external onlyOwner validTier(_tierId) {
        tiers[_tierId].isActive = !tiers[_tierId].isActive;
    }

    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 500, "Fee too high"); // Max 5%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    function setTreasuryAddress(address _newAddress) external onlyOwner {
        require(_newAddress != address(0), "Invalid address");
        treasuryAddress = _newAddress;
        emit TreasuryAddressUpdated(_newAddress);
    }

    function setMinMaxInvestment(uint256 _min, uint256 _max) external onlyOwner {
        require(_min > 0, "Invalid minimum amount");
        require(_max > _min, "Invalid maximum amount");
        minInvestmentAmount = _min;
        maxInvestmentAmount = _max;
    }

    function activateEmergencyMode() external onlyOwner {
        emergencyMode = true;
        emit EmergencyModeActivated(true);
    }

    function deactivateEmergencyMode() external onlyOwner {
        emergencyMode = false;
        emit EmergencyModeActivated(false);
    }

    function getUserInvestments(address _user) external view returns (Investment[] memory) {
        return userInvestments[_user];
    }

    function getTierDetails(uint256 _tierId) external view returns (Tier memory) {
        return tiers[_tierId];
    }

    // Function to receive HBAR
    receive() external payable {}
} 