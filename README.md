# Faida Investment Platform

A decentralized investment platform built on Hedera Hashgraph, allowing users to invest in different tiers with various interest rates and lock periods.

## Features

- Multiple investment tiers with different interest rates
- Referral system with rewards
- Investment locking mechanism
- Early withdrawal penalties
- Platform analytics
- Emergency mode for security
- Daily rewards calculation

## Investment Tiers

1. **Starter Tier**
   - Minimum: 100 HBAR
   - Maximum: 1000 HBAR
   - Duration: 30 days
   - Interest Rate: 5%
   - Early Withdrawal Penalty: 10%

2. **Growth Tier**
   - Minimum: 1000 HBAR
   - Maximum: 5000 HBAR
   - Duration: 90 days
   - Interest Rate: 8%
   - Early Withdrawal Penalty: 15%

3. **Premium Tier**
   - Minimum: 5000 HBAR
   - Maximum: 20000 HBAR
   - Duration: 180 days
   - Interest Rate: 12%
   - Early Withdrawal Penalty: 20%

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Hedera Testnet Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/faida-investment.git
cd faida-investment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add your Hedera credentials:
```
PRIVATE_KEY=your_private_key_here
HEDERA_NETWORK_URL=https://testnet.hashio.io/api
```

### Usage

1. Compile the contract:
```bash
npm run compile
```

2. Deploy to Hedera Testnet:
```bash
npm run deploy
```

## Smart Contract Functions

### Investment Functions
- `invest(uint256 _tierId, address _referrer)`: Invest in a specific tier
- `withdraw(uint256 _investmentId)`: Withdraw investment and rewards
- `claimRewards(uint256 _investmentId)`: Claim accumulated rewards
- `lockInvestment(uint256 _investmentId, uint256 _lockPeriod)`: Lock investment
- `unlockInvestment(uint256 _investmentId)`: Unlock investment

### Referral Functions
- `generateReferralCode()`: Generate a unique referral code
- `getReferralStats(address _user)`: Get referral statistics

### Analytics Functions
- `getAnalytics()`: Get platform statistics
- `getInvestmentDetails(uint256 _investmentId)`: Get investment details
- `getTierDetails(uint256 _tierId)`: Get tier information

## Security Features

- Reentrancy protection
- Emergency mode
- Investment locking
- Early withdrawal penalties
- Access control
- Pausable functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hedera Hashgraph
- OpenZeppelin Contracts
- Hardhat 