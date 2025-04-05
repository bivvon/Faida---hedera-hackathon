const {
  Client,
  PrivateKey,
  AccountId,
  Hbar,
  AccountCreateTransaction,
  AccountBalanceQuery,
  TransferTransaction
} = require('@hashgraph/sdk');

class HederaClient {
  constructor() {
    this.client = Client.forTestnet();
    this.operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    this.operatorKey = PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY);
    this.client.setOperator(this.operatorId, this.operatorKey);
  }

  async createAccount(publicKey) {
    try {
      const response = await new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(Hbar.fromTinybars(10))
        .execute(this.client);

      const receipt = await response.getReceipt(this.client);
      return receipt.accountId;
    } catch (error) {
      console.error('Error creating account:', error);
      return null;
    }
  }

  async getBalance(accountId) {
    try {
      const query = new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId));
      const balance = await query.execute(this.client);
      return balance.hbars;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }

  async transferHbar(toAccount, amount) {
    try {
      const response = await new TransferTransaction()
        .addHbarTransfer(this.operatorId, Hbar.fromTinybars(-amount))
        .addHbarTransfer(AccountId.fromString(toAccount), Hbar.fromTinybars(amount))
        .execute(this.client);

      await response.getReceipt(this.client);
      return true;
    } catch (error) {
      console.error('Error transferring hbar:', error);
      return false;
    }
  }
}

const hederaClient = new HederaClient();
module.exports = { hederaClient }; 