const userService = require('../services/userService');

const addToWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { stockSymbol } = req.body;

        if (!stockSymbol) {
            return res.status(400).json({ error: 'Stock symbol is required' });
        }

        const item = await userService.addToWatchlist(userId, stockSymbol);
        res.status(201).json({ message: 'Added to watchlist successfully', ...item });
    } catch (error) {
        console.error('Watchlist add error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await userService.getWatchlist(userId);
        res.json(items);
    } catch (error) {
        console.error('Watchlist fetch error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const saveGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetAmount, years } = req.body;

        if (!targetAmount || !years) {
            return res.status(400).json({ error: 'Target amount and years are required' });
        }

        const goal = await userService.saveGoal(userId, targetAmount, years);
        res.status(201).json({ message: 'Goal saved successfully', ...goal });
    } catch (error) {
        console.error('Goal save error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const saveInvestment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, date } = req.body;

        if (!amount || !date) {
            return res.status(400).json({ error: 'Amount and date are required' });
        }

        const investment = await userService.saveInvestment(userId, amount, date);
        res.status(201).json({ message: 'Investment saved successfully', ...investment });
    } catch (error) {
        console.error('Investment save error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const saveChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }

        const chat = await userService.saveChatHistory(userId, question, answer);
        res.status(201).json({ message: 'Chat history saved successfully', ...chat });
    } catch (error) {
        console.error('Chat save error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    saveGoal,
    saveInvestment,
    saveChatHistory
};
