const { ethers } = require('ethers');
const { hederaClient } = require('./hederaClient');

class DeFiService {
  constructor() {
    this.providers = new Map();
    this.contracts = new Map();
  }

  async initializeProvider(chainId, rpcUrl) {
    if (!this.providers.has(chainId)) {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      this.providers.set(chainId, provider);
    }
    return this.providers.get(chainId);
  }

  async getContract(chainId, address, abi) {
    const key = `${chainId}:${address}`;
    if (!this.contracts.has(key)) {
      const provider = await this.initializeProvider(chainId, process.env[`RPC_URL_${chainId}`]);
      const contract = new ethers.Contract(address, abi, provider);
      this.contracts.set(key, contract);
    }
    return this.contracts.get(key);
  }

  async getLendingPoolInfo(chainId, poolAddress) {
    const lendingPoolABI = [
      'function getReserveData(address asset) view returns (tuple(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint40))',
      'function getReserveConfigurationData(address asset) view returns (tuple(uint256,uint256,uint256,uint256,uint256,uint256,bool,bool,bool,bool,bool))'
    ];

    const contract = await this.getContract(chainId, poolAddress, lendingPoolABI);
    const reserveData = await contract.getReserveData(process.env.USDC_ADDRESS);
    const configData = await contract.getReserveConfigurationData(process.env.USDC_ADDRESS);

    return {
      liquidityRate: reserveData[0],
      stableBorrowRate: reserveData[1],
      variableBorrowRate: reserveData[2],
      utilizationRate: reserveData[3],
      availableLiquidity: reserveData[4],
      totalStableDebt: reserveData[5],
      totalVariableDebt: reserveData[6],
      averageStableBorrowRate: reserveData[7],
      lastUpdateTimestamp: reserveData[8],
      isActive: configData[6],
      isFrozen: configData[7],
      borrowingEnabled: configData[8],
      stableBorrowingEnabled: configData[9],
      isPaused: configData[10]
    };
  }

  async getYieldFarmingInfo(chainId, farmAddress) {
    const farmABI = [
      'function poolLength() view returns (uint256)',
      'function totalAllocPoint() view returns (uint256)',
      'function rewardPerBlock() view returns (uint256)',
      'function poolInfo(uint256) view returns (tuple(address,uint256,uint256,uint256,uint256))',
      'function userInfo(uint256,address) view returns (tuple(uint256,uint256))'
    ];

    const contract = await this.getContract(chainId, farmAddress, farmABI);
    const poolLength = await contract.poolLength();
    const totalAllocPoint = await contract.totalAllocPoint();
    const rewardPerBlock = await contract.rewardPerBlock();

    const pools = [];
    for (let i = 0; i < poolLength; i++) {
      const poolInfo = await contract.poolInfo(i);
      pools.push({
        lpToken: poolInfo[0],
        allocPoint: poolInfo[1],
        lastRewardBlock: poolInfo[2],
        accRewardPerShare: poolInfo[3],
        totalStaked: poolInfo[4]
      });
    }

    return {
      totalAllocPoint,
      rewardPerBlock,
      pools
    };
  }

  async getDEXInfo(chainId, routerAddress) {
    const routerABI = [
      'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)',
      'function getAmountsIn(uint amountOut, address[] memory path) view returns (uint[] memory amounts)'
    ];

    const contract = await this.getContract(chainId, routerAddress, routerABI);
    
    // Example: Get USDC/ETH price
    const path = [process.env.USDC_ADDRESS, process.env.WETH_ADDRESS];
    const amountsOut = await contract.getAmountsOut(ethers.utils.parseUnits('1', 6), path);
    
    return {
      usdcToEth: ethers.utils.formatUnits(amountsOut[1], 18),
      ethToUsdc: ethers.utils.formatUnits(amountsOut[0], 6)
    };
  }

  async getHederaDeFiInfo(contractId) {
    const contract = await hederaClient.getContract(contractId);
    
    // Get contract state
    const state = await contract.getState();
    
    return {
      contractId,
      state,
      lastUpdated: new Date().toISOString()
    };
  }

  async calculateOptimalStrategy(chainId, userAddress, riskProfile) {
    const strategies = [];
    
    // Get lending pool opportunities
    const lendingPools = process.env.LENDING_POOLS.split(',');
    for (const pool of lendingPools) {
      const poolInfo = await this.getLendingPoolInfo(chainId, pool);
      if (poolInfo.isActive && !poolInfo.isPaused) {
        strategies.push({
          type: 'lending',
          pool,
          apy: poolInfo.liquidityRate / 1e27,
          risk: 'low',
          recommendedAmount: this.calculateRecommendedAmount(riskProfile, 'lending')
        });
      }
    }

    // Get yield farming opportunities
    const farms = process.env.YIELD_FARMS.split(',');
    for (const farm of farms) {
      const farmInfo = await this.getYieldFarmingInfo(chainId, farm);
      const apy = this.calculateFarmAPY(farmInfo);
      strategies.push({
        type: 'farming',
        farm,
        apy,
        risk: 'medium',
        recommendedAmount: this.calculateRecommendedAmount(riskProfile, 'farming')
      });
    }

    // Sort strategies by APY and risk profile
    return strategies
      .sort((a, b) => {
        if (riskProfile === 'conservative') {
          return a.risk.localeCompare(b.risk) || b.apy - a.apy;
        }
        return b.apy - a.apy;
      });
  }

  calculateFarmAPY(farmInfo) {
    const blocksPerYear = 2102400; // Assuming 15s block time
    const totalRewardsPerYear = farmInfo.rewardPerBlock.mul(blocksPerYear);
    return totalRewardsPerYear.div(farmInfo.totalAllocPoint).toNumber() / 1e18;
  }

  calculateRecommendedAmount(riskProfile, strategyType) {
    const baseAmounts = {
      conservative: {
        lending: 0.6,
        farming: 0.2
      },
      moderate: {
        lending: 0.4,
        farming: 0.4
      },
      aggressive: {
        lending: 0.2,
        farming: 0.6
      }
    };

    return baseAmounts[riskProfile][strategyType];
  }
}

module.exports = new DeFiService(); 