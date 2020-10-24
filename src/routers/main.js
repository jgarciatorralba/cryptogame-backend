import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import Stock from '../models/stock.js';
import User from '../models/user.js';
import Transaction from '../models/transaction.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', (req, res) => {
  res.send('Protected profile page');
});

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({include: [{model: User, as: 'user'}, {model: Stock, as: 'stock'}]})
    let result = []

    for (let transaction of transactions) {
      result.push({id: transaction.transaction_id, user: transaction.user.name, coin: transaction.stock.name, quantity: transaction.cuantity, value: transaction.value, date: transaction.createdAt})
    }
    res.json(result);
  } catch(error) {
    res.status(404).json({ data: null, error: 'Unknown error' });
  } 
});

export default router;
