const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    return { id: result.insertId, name, email };
};

const getUserByEmail = async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const addToWatchlist = async (userId, stockSymbol) => {
    const [result] = await db.execute(
        'INSERT INTO watchlist (user_id, stock_symbol) VALUES (?, ?)',
        [userId, stockSymbol]
    );
    return { id: result.insertId, userId, stockSymbol };
};

const getWatchlist = async (userId) => {
    const [rows] = await db.execute('SELECT * FROM watchlist WHERE user_id = ?', [userId]);
    return rows;
};

const saveGoal = async (userId, targetAmount, years) => {
    const [result] = await db.execute(
        'INSERT INTO goals (user_id, target_amount, years) VALUES (?, ?, ?)',
        [userId, targetAmount, years]
    );
    return { id: result.insertId, userId, targetAmount, years };
};

const saveInvestment = async (userId, amount, date) => {
    const [result] = await db.execute(
        'INSERT INTO investments (user_id, amount, date) VALUES (?, ?, ?)',
        [userId, amount, date]
    );
    return { id: result.insertId, userId, amount, date };
};

const saveChatHistory = async (userId, question, answer) => {
    const [result] = await db.execute(
        'INSERT INTO chat_history (user_id, question, answer) VALUES (?, ?, ?)',
        [userId, question, answer]
    );
    return { id: result.insertId, userId, question, answer };
};

module.exports = {
    createUser,
    getUserByEmail,
    addToWatchlist,
    getWatchlist,
    saveGoal,
    saveInvestment,
    saveChatHistory
};
