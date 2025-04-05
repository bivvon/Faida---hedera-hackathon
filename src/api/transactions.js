const express = require('express');
const router = express.Router();
const transactionService = require('../core/transactionService');
const validationService = require('../core/validationService');

// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { error } = validationService.validate('transaction', req.body);
    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Execute a pending transaction
router.post('/:id/execute', async (req, res) => {
  try {
    const transaction = await transactionService.executeTransaction(req.params.id);
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user transactions
router.get('/', async (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      status: req.query.status,
      assetType: req.query.assetType,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip)
    };

    const transactions = await transactionService.getUserTransactions(req.user.id, filters);
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel a pending transaction
router.post('/:id/cancel', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending transactions can be cancelled' });
    }

    transaction.status = 'cancelled';
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 