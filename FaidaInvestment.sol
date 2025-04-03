// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FaidaInvestment {
    // Investment tier structure
    struct Tier {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 duration; // in days
        uint256 interestRate; // in basis points (1% = 100)
    }

    // Investment structure
    struct Investment {
        uint256 amount;
        uint256 tierId;
        uint256 startTime;
        bool active;
    }

    // State variables
    mapping(uint256 => Tier) public tiers;
    mapping(address => Investment) public investments;
    address public owner;
    uint256 public totalInvestors;
    uint256 public totalInvestment;

    // Events
    event InvestmentMade(address indexed investor, uint256 amount, uint256 tierId);
    event InvestmentWithdrawn(address indexed investor, uint256 amount);
    event TierAdded(uint256 indexed tierId, uint256 minAmount, uint256 maxAmount, uint256 duration, uint256 interestRate);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier validTier(uint256 _tierId) {
        require(_tierId < 3, "Invalid tier ID");
        _;
    }

    constructor() {
        owner = msg.sender;
        
        // Initialize tiers
        tiers[0] = Tier({
            minAmount: 0.1 ether,
            maxAmount: 1 ether,
            duration: 30,
            interestRate: 500 // 5%
        });

        tiers[1] = Tier({
            minAmount: 1 ether,
            maxAmount: 5 ether,
            duration: 90,
            interestRate: 800 // 8%
        });

        tiers[2] = Tier({
            minAmount: 5 ether,
            maxAmount: 20 ether,
            duration: 180,
            interestRate: 1200 // 12%
        });
    }

    function invest(uint256 _tierId) external payable validTier(_tierId) {
        require(msg.value >= tiers[_tierId].minAmount, "Investment amount too low");
        require(msg.value <= tiers[_tierId].maxAmount, "Investment amount too high");
        require(!investments[msg.sender].active, "Already have an active investment");

        // Create new investment
        investments[msg.sender] = Investment({
            amount: msg.value,
            tierId: _tierId,
            startTime: block.timestamp,
            active: true
        });

        totalInvestors++;
        totalInvestment += msg.value;

        emit InvestmentMade(msg.sender, msg.value, _tierId);
    }

    function getInvestmentDetails(address _investor) external view returns (
        uint256 amount,
        uint256 tierId,
        uint256 startTime,
        bool active,
        uint256 endTime,
        uint256 interestRate
    ) {
        Investment memory investment = investments[_investor];
        Tier memory tier = tiers[investment.tierId];
        
        return (
            investment.amount,
            investment.tierId,
            investment.startTime,
            investment.active,
            investment.startTime + (tier.duration * 1 days),
            tier.interestRate
        );
    }

    function withdraw() external {
        Investment storage investment = investments[msg.sender];
        require(investment.active, "No active investment");
        
        Tier memory tier = tiers[investment.tierId];
        uint256 endTime = investment.startTime + (tier.duration * 1 days);
        require(block.timestamp >= endTime, "Investment period not ended");

        uint256 interest = (investment.amount * tier.interestRate * tier.duration) / (36500 * 100);
        uint256 totalAmount = investment.amount + interest;

        investment.active = false;
        totalInvestment -= investment.amount;

        (bool success, ) = msg.sender.call{value: totalAmount}("");
        require(success, "Transfer failed");

        emit InvestmentWithdrawn(msg.sender, totalAmount);
    }

    function addTier(
        uint256 _tierId,
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
            interestRate: _interestRate
        });

        emit TierAdded(_tierId, _minAmount, _maxAmount, _duration, _interestRate);
    }

    // Function to receive ETH
    receive() external payable {}
} 