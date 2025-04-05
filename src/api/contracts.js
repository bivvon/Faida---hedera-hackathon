const express = require('express');
const router = express.Router();
const smartContractService = require('../core/smartContractService');

// Deploy a new contract
router.post('/deploy', async (req, res) => {
  try {
    const { bytecode, gas } = req.body;
    const contractId = await smartContractService.deployContract(bytecode, gas);
    res.json({ contractId: contractId.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute a contract function
router.post('/execute/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    const { functionName, params, gas } = req.body;
    const receipt = await smartContractService.executeContractFunction(
      contractId,
      functionName,
      params,
      gas
    );
    res.json({ receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Call a contract function (read-only)
router.post('/call/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    const { functionName, params } = req.body;
    const result = await smartContractService.callContractFunction(
      contractId,
      functionName,
      params
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 