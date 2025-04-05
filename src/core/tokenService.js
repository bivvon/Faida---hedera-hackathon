const {
  TokenCreateTransaction,
  TokenAssociateTransaction,
  TokenGrantKycTransaction,
  TokenMintTransaction,
  TokenBurnTransaction,
  TokenWipeTransaction,
  TokenDeleteTransaction,
  TokenId,
  AccountId,
  PrivateKey,
  Hbar
} = require('@hashgraph/sdk');
const { hederaClient } = require('./hederaClient');

class TokenService {
  constructor() {
    this.client = hederaClient.client;
  }

  async createToken({
    name,
    symbol,
    decimals,
    initialSupply,
    treasuryAccountId,
    adminKey,
    kycKey,
    freezeKey,
    wipeKey,
    supplyKey
  }) {
    try {
      const transaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setDecimals(decimals)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(AccountId.fromString(treasuryAccountId))
        .setAdminKey(adminKey ? PrivateKey.fromString(adminKey) : null)
        .setKycKey(kycKey ? PrivateKey.fromString(kycKey) : null)
        .setFreezeKey(freezeKey ? PrivateKey.fromString(freezeKey) : null)
        .setWipeKey(wipeKey ? PrivateKey.fromString(wipeKey) : null)
        .setSupplyKey(supplyKey ? PrivateKey.fromString(supplyKey) : null);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      return receipt.tokenId;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  async associateToken(accountId, tokenId) {
    try {
      const transaction = new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([TokenId.fromString(tokenId)]);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      return receipt;
    } catch (error) {
      console.error('Error associating token:', error);
      throw error;
    }
  }

  async grantKyc(accountId, tokenId) {
    try {
      const transaction = new TokenGrantKycTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenId(TokenId.fromString(tokenId));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      return receipt;
    } catch (error) {
      console.error('Error granting KYC:', error);
      throw error;
    }
  }

  async mintToken(tokenId, amount) {
    try {
      const transaction = new TokenMintTransaction()
        .setTokenId(TokenId.fromString(tokenId))
        .setAmount(amount);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      return receipt;
    } catch (error) {
      console.error('Error minting token:', error);
      throw error;
    }
  }

  async burnToken(tokenId, amount) {
    try {
      const transaction = new TokenBurnTransaction()
        .setTokenId(TokenId.fromString(tokenId))
        .setAmount(amount);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      return receipt;
    } catch (error) {
      console.error('Error burning token:', error);
      throw error;
    }
  }
}

const tokenService = new TokenService();
module.exports = tokenService; 