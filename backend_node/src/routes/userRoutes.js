const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/watchlist', authenticateToken, userController.addToWatchlist);
router.get('/watchlist', authenticateToken, userController.getWatchlist);
router.post('/save-goal', authenticateToken, userController.saveGoal);
router.post('/save-investment', authenticateToken, userController.saveInvestment);
router.post('/save-chat', authenticateToken, userController.saveChatHistory);

module.exports = router;
