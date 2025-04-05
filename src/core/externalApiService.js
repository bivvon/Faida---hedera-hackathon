const axios = require('axios');
const { ethers } = require('ethers');
const cacheService = require('./cacheService');

class ExternalApiService {
  constructor() {
    this.coingecko = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
      timeout: 5000
    });

    this.defillama = axios.create({
      baseURL: 'https://api.llama.fi',
      timeout: 5000
    });

    this.moralis = axios.create({
      baseURL: 'https://deep-index.moralis.io/api/v2',
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY
      },
      timeout: 5000
    });
  }

  async getMarketData(symbols = ['bitcoin', 'ethereum', 'hedera-hashgraph']) {
    const cacheKey = `market:${symbols.join(',')}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.coingecko.get('/simple/price', {
        params: {
          ids: symbols.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true
        }
      });
      await cacheService.set(cacheKey, response.data, 300); // Cache for 5 minutes
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async getDeFiMetrics() {
    const cacheKey = 'defi:metrics';
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const [protocols, chains] = await Promise.all([
        this.defillama.get('/protocols'),
        this.defillama.get('/chains')
      ]);

      const data = {
        protocols: protocols.data,
        chains: chains.data
      };

      await cacheService.set(cacheKey, data, 1800); // Cache for 30 minutes
      return data;
    } catch (error) {
      console.error('Error fetching DeFi metrics:', error);
      throw error;
    }
  }

  async getTokenPrice(address, chain = 'eth') {
    const cacheKey = `token:price:${chain}:${address}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.moralis.get(`/erc20/${address}/price`, {
        params: { chain }
      });
      await cacheService.set(cacheKey, response.data, 300); // Cache for 5 minutes
      return response.data;
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw error;
    }
  }

  async getNFTMetadata(address, tokenId, chain = 'eth') {
    const cacheKey = `nft:metadata:${chain}:${address}:${tokenId}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.moralis.get(`/nft/${address}/${tokenId}`, {
        params: { chain, format: 'decimal' }
      });
      await cacheService.set(cacheKey, response.data, 3600); // Cache for 1 hour
      return response.data;
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      throw error;
    }
  }

  async getHistoricalData(symbol, days = 30) {
    const cacheKey = `historical:${symbol}:${days}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.coingecko.get(`/coins/${symbol}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days
        }
      });
      await cacheService.set(cacheKey, response.data, 3600); // Cache for 1 hour
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  async getGasPrices(chain = 'eth') {
    const cacheKey = `gas:${chain}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env[`RPC_URL_${chain.toUpperCase()}`]
      );
      const feeData = await provider.getFeeData();
      
      const data = {
        lastBaseFeePerGas: ethers.utils.formatUnits(feeData.lastBaseFeePerGas, 'gwei'),
        maxFeePerGas: ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei'),
        maxPriorityFeePerGas: ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'),
        gasPrice: ethers.utils.formatUnits(feeData.gasPrice, 'gwei')
      };

      await cacheService.set(cacheKey, data, 60); // Cache for 1 minute
      return data;
    } catch (error) {
      console.error('Error fetching gas prices:', error);
      throw error;
    }
  }

  async getTokenBalances(address, chain = 'eth') {
    const cacheKey = `balances:${chain}:${address}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.moralis.get(`/${address}/erc20`, {
        params: { chain }
      });
      await cacheService.set(cacheKey, response.data, 300); // Cache for 5 minutes
      return response.data;
    } catch (error) {
      console.error('Error fetching token balances:', error);
      throw error;
    }
  }

  async getNFTs(address, chain = 'eth') {
    const cacheKey = `nfts:${chain}:${address}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    try {
      const response = await this.moralis.get(`/${address}/nft`, {
        params: { chain, format: 'decimal' }
      });
      await cacheService.set(cacheKey, response.data, 300); // Cache for 5 minutes
      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      throw error;
    }
  }
}

module.exports = new ExternalApiService(); 