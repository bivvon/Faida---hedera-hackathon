const {
  ContractCreateTransaction,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  ContractCallQuery,
  Hbar
} = require('@hashgraph/sdk');
const { hederaClient } = require('./hederaClient');

class SmartContractService {
  constructor() {
    this.client = hederaClient.client;
  }

  async deployContract(bytecode, gas = 1000000) {
    try {
      const transaction = new ContractCreateTransaction()
        .setBytecode(bytecode)
        .setGas(gas);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      return receipt.contractId;
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
    }
  }

  async executeContractFunction(contractId, functionName, params, gas = 100000) {
    try {
      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gas)
        .setFunction(functionName, params);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);
      return receipt;
    } catch (error) {
      console.error('Error executing contract function:', error);
      throw error;
    }
  }

  async callContractFunction(contractId, functionName, params) {
    try {
      const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(functionName, params);

      const response = await query.execute(this.client);
      return response;
    } catch (error) {
      console.error('Error calling contract function:', error);
      throw error;
    }
  }
}

const smartContractService = new SmartContractService();
module.exports = smartContractService; 