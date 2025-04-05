const WebSocket = require('ws');
const { hederaClient } = require('./hederaClient');
const defiService = require('./defiService');

class NotificationService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.subscriptions = new Map();
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });
    
    this.wss.on('connection', (ws, req) => {
      const userId = req.headers['user-id'];
      if (!userId) {
        ws.close();
        return;
      }

      this.clients.set(userId, ws);
      
      ws.on('close', () => {
        this.clients.delete(userId);
        this.subscriptions.delete(userId);
      });

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(userId, data);
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });
    });

    // Start monitoring services
    this.startMarketMonitoring();
    this.startDeFiMonitoring();
    this.startHederaMonitoring();
  }

  async handleMessage(userId, data) {
    switch (data.type) {
      case 'subscribe':
        await this.handleSubscription(userId, data);
        break;
      case 'unsubscribe':
        await this.handleUnsubscription(userId, data);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  async handleSubscription(userId, data) {
    const { channel, params } = data;
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set());
    }
    this.subscriptions.get(userId).add(channel);
    
    // Send initial data
    switch (channel) {
      case 'market':
        await this.sendMarketData(userId, params);
        break;
      case 'defi':
        await this.sendDeFiData(userId, params);
        break;
      case 'hedera':
        await this.sendHederaData(userId, params);
        break;
    }
  }

  async handleUnsubscription(userId, data) {
    const { channel } = data;
    if (this.subscriptions.has(userId)) {
      this.subscriptions.get(userId).delete(channel);
    }
  }

  async sendNotification(userId, notification) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  }

  async startMarketMonitoring() {
    setInterval(async () => {
      // Monitor market conditions
      const marketData = await this.getMarketData();
      this.broadcastToSubscribers('market', marketData);
    }, 60000); // Update every minute
  }

  async startDeFiMonitoring() {
    setInterval(async () => {
      // Monitor DeFi protocols
      const defiData = await this.getDeFiData();
      this.broadcastToSubscribers('defi', defiData);
    }, 300000); // Update every 5 minutes
  }

  async startHederaMonitoring() {
    setInterval(async () => {
      // Monitor Hedera network
      const hederaData = await this.getHederaData();
      this.broadcastToSubscribers('hedera', hederaData);
    }, 60000); // Update every minute
  }

  async getMarketData() {
    // Implement market data fetching
    return {
      timestamp: new Date().toISOString(),
      prices: {},
      volumes: {},
      changes: {}
    };
  }

  async getDeFiData() {
    // Implement DeFi data fetching
    return {
      timestamp: new Date().toISOString(),
      protocols: {},
      yields: {},
      risks: {}
    };
  }

  async getHederaData() {
    // Implement Hedera data fetching
    return {
      timestamp: new Date().toISOString(),
      network: {},
      contracts: {},
      tokens: {}
    };
  }

  broadcastToSubscribers(channel, data) {
    for (const [userId, subscriptions] of this.subscriptions) {
      if (subscriptions.has(channel)) {
        this.sendNotification(userId, {
          type: 'update',
          channel,
          data
        });
      }
    }
  }

  async sendMarketData(userId, params) {
    const data = await this.getMarketData();
    this.sendNotification(userId, {
      type: 'market',
      data
    });
  }

  async sendDeFiData(userId, params) {
    const data = await this.getDeFiData();
    this.sendNotification(userId, {
      type: 'defi',
      data
    });
  }

  async sendHederaData(userId, params) {
    const data = await this.getHederaData();
    this.sendNotification(userId, {
      type: 'hedera',
      data
    });
  }
}

module.exports = new NotificationService(); 