import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import Stock from '../models/stock.js';
import User from '../models/user.js';
import Wallet from '../models/wallet.js';
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

router.get('/wallet', async (req, res) => {
  try {
    const id = req.user.id;
    let wallet = [];
    let valueOfAssets = 0;
    const walletPositions = await Wallet.findAll({where: {user_id: id}, include: [{model: Stock, as: 'stock'}]})

    for (const position of walletPositions) {
      const coin = await Stock.findOne({where: {stock_id: position.stock_id}})
      wallet.push({coin: position.stock.symbol, quantity: position.quantity, price: coin.dataValues.price, value: position.quantity * coin.dataValues.price})
      valueOfAssets += position.quantity * coin.dataValues.price
    }

    const balance = await User.findOne({where: {user_id: id}, attributes: ['balance']});
    wallet.push({balance: balance.dataValues.balance + valueOfAssets});

    res.json(wallet);

  } catch(error) {
    console.log(error);
  } 
});

export default router;
