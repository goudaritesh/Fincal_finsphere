const axios = require('axios');
const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

const getMarketIndices = async () => {
    try {
        const response = await axios.get(`${AI_AGENT_URL}/market/indices`);
        return response.data;
    } catch (error) {
        console.warn('Falling back to mock indices');
        return [
            { name: 'NIFTY 50', value: 23151.10, change: '-2.06%', isUp: false },
            { name: 'SENSEX', value: 74563.92, change: '-1.93%', isUp: false },
            { name: 'NIFTY BANK', value: 48201.15, change: '-1.45%', isUp: false }
        ];
    }
};

const getTopGainers = async () => {
    try {
        const response = await axios.get(`${AI_AGENT_URL}/market/movers`);
        return response.data.gainers;
    } catch (error) {
        return [
            { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.45, change: '+2.40%' }
        ];
    }
};

const getTopLosers = async () => {
    try {
        const response = await axios.get(`${AI_AGENT_URL}/market/movers`);
        return response.data.losers;
    } catch (error) {
        return [
            { symbol: 'ADANIENT', name: 'Adani Enterprises', price: 3145.45, change: '-25.60%' }
        ];
    }
};

const getStocks = async () => {
    return [
        { symbol: 'AAPL', name: 'Apple Inc', price: 182.52, change: '+1.12%' },
        { symbol: 'MSFT', name: 'Microsoft Corp', price: 411.65, change: '+0.63%' },
        { symbol: 'GOOGL', name: 'Alphabet Inc', price: 144.09, change: '-0.71%' }
    ];
};

module.exports = {
    getMarketIndices,
    getTopGainers,
    getTopLosers,
    getStocks
};
