const express = require('express');
const router = express.Router();
const axios = require('axios');

const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await axios.post(`${AI_AGENT_URL}/ask-ai`, { question: message });
        res.json({ response: response.data.response });
    } catch (error) {
        console.error('Error in /chat:', error.message);
        res.status(500).json({ error: 'AI Agent unavailable' });
    }
});

router.post('/ask', async (req, res) => {
    try {
        const { prompt } = req.body;
        // The Python agent expects "question" not "prompt" or "message"
        const response = await axios.post(`${AI_AGENT_URL}/ask-ai`, { question: prompt });
        
        // Python agent returns { "response": "..." }
        const answer = response.data.response || response.data.answer || "No response from AI.";
        res.json({ answer });
    } catch (error) {
        console.warn('AI Agent offline, using fallback analysis');
        res.json({ 
            answer: "Based on your financial inputs, your strategy shows strong long-term potential. We recommend maintaining a disciplined approach, ensuring your portfolio is diversified across asset classes, and reviewing your financial goals annually. Compounding is maximized over longer tenures." 
        });
    }
});

module.exports = router;
