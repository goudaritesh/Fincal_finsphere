const marketService = require('../services/marketService');

const getMarketIndices = async (req, res) => {
    try {
        const data = await marketService.getMarketIndices();
        res.json(data);
    } catch (error) {
        console.error('Market indices error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTopGainers = async (req, res) => {
    try {
        const data = await marketService.getTopGainers();
        res.json(data);
    } catch (error) {
        console.error('Top gainers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTopLosers = async (req, res) => {
    try {
        const data = await marketService.getTopLosers();
        res.json(data);
    } catch (error) {
        console.error('Top losers error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStocks = async (req, res) => {
    try {
        const data = await marketService.getStocks();
        res.json(data);
    } catch (error) {
        console.error('Stocks error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getMarketIndices,
    getTopGainers,
    getTopLosers,
    getStocks
};
