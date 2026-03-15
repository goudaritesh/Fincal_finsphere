const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const marketRoutes = require('./marketRoutes');
const aiRoutes = require('./aiRoutes');

// Root API path mapping
router.use('/', authRoutes); // /register, /login
router.use('/', userRoutes); // /watchlist, /save-goal
router.use('/', marketRoutes); // /market-indices, /top-gainers, etc.

// Keep existing AI routes
router.use('/ai', aiRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

module.exports = router;
