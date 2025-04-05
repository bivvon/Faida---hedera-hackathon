const axios = require('axios');
const cacheService = require('./cacheService');
const monitoringService = require('./monitoringService');

class MarketDataService {
  constructor() {
    this.coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';
    this.moralisBaseUrl = 'https://deep-index.moralis.io/api/v2';
    this.llamaBaseUrl = 'https://api.llama.fi';
  }

  async getTokenPrice(tokenId) {
    try {
      const cacheKey = `token_price_${tokenId}`;
      const cachedPrice = await cacheService.get(cacheKey);
      if (cachedPrice) {
        return cachedPrice;
      }

      const response = await axios.get(`${this.coingeckoBaseUrl}/simple/price`, {
        params: {
          ids: tokenId,
          vs_currencies: 'usd'
        }
      });

      const price = response.data[tokenId].usd;
      await cacheService.set(cacheKey, price, 60); // Cache for 1 minute
      return price;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getNftPrice(collectionId) {
    try {
      const cacheKey = `nft_price_${collectionId}`;
      const cachedPrice = await cacheService.get(cacheKey);
      if (cachedPrice) {
        return cachedPrice;
      }

      const response = await axios.get(`${this.moralisBaseUrl}/nft/${collectionId}/stats`, {
        headers: {
          'X-API-Key': process.env.MORALIS_API_KEY
        }
      });

      const price = response.data.average_price;
      await cacheService.set(cacheKey, price, 300); // Cache for 5 minutes
      return price;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getDefiTokenPrice(protocolId) {
    try {
      const cacheKey = `defi_price_${protocolId}`;
      const cachedPrice = await cacheService.get(cacheKey);
      if (cachedPrice) {
        return cachedPrice;
      }

      const response = await axios.get(`${this.llamaBaseUrl}/protocol/${protocolId}`);
      const price = response.data.tvl;
      await cacheService.set(cacheKey, price, 300); // Cache for 5 minutes
      return price;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getMarketOverview() {
    try {
      const cacheKey = 'market_overview';
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const [globalData, trendingCoins] = await Promise.all([
        axios.get(`${this.coingeckoBaseUrl}/global`),
        axios.get(`${this.coingeckoBaseUrl}/search/trending`)
      ]);

      const overview = {
        marketCap: globalData.data.data.total_market_cap.usd,
        volume24h: globalData.data.data.total_volume.usd,
        btcDominance: globalData.data.data.market_cap_percentage.btc,
        trending: trendingCoins.data.coins.map(coin => ({
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          marketCapRank: coin.item.market_cap_rank,
          priceChange24h: coin.item.data.price_change_percentage_24h
        }))
      };

      await cacheService.set(cacheKey, overview, 300); // Cache for 5 minutes
      return overview;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getHistoricalData(tokenId, days = 30) {
    try {
      const cacheKey = `historical_${tokenId}_${days}`;
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${this.coingeckoBaseUrl}/coins/${tokenId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days
        }
      });

      const historicalData = {
        prices: response.data.prices,
        marketCaps: response.data.market_caps,
        totalVolumes: response.data.total_volumes
      };

      await cacheService.set(cacheKey, historicalData, 3600); // Cache for 1 hour
      return historicalData;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getDefiProtocols() {
    try {
      const cacheKey = 'defi_protocols';
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${this.llamaBaseUrl}/protocols`);
      const protocols = response.data.map(protocol => ({
        id: protocol.id,
        name: protocol.name,
        symbol: protocol.symbol,
        tvl: protocol.tvl,
        chain: protocol.chain,
        category: protocol.category
      }));

      await cacheService.set(cacheKey, protocols, 3600); // Cache for 1 hour
      return protocols;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }

  async getNftCollections() {
    try {
      const cacheKey = 'nft_collections';
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${this.moralisBaseUrl}/nft/collections`, {
        headers: {
          'X-API-Key': process.env.MORALIS_API_KEY
        }
      });

      const collections = response.data.result.map(collection => ({
        id: collection.token_address,
        name: collection.name,
        symbol: collection.symbol,
        totalSupply: collection.total_supply,
        floorPrice: collection.floor_price,
        volume24h: collection.volume_24h
      }));

      await cacheService.set(cacheKey, collections, 3600); // Cache for 1 hour
      return collections;
    } catch (error) {
      monitoringService.logError(error);
      throw error;
    }
  }
}

module.exports = new MarketDataService(); 