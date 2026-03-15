const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/market-indices', marketController.getMarketIndices);
router.get('/top-gainers', marketController.getTopGainers);
router.get('/top-losers', marketController.getTopLosers);

// Protected routes
router.get('/stocks', authenticateToken, marketController.getStocks);

module.exports = router;
