import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/admin.js';
import Stock from '../models/stock.js';
import User from '../models/user.js';
import Wallet from '../models/wallet.js';
import Transaction from '../models/transaction.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/coin/:coinId', async (req, res) => {
  const coinId = req.params.coinId;
  const coin = await Stock.findOne({ where: { stock_id: coinId } })
  res.json({ data: {symbol: coin.symbol, pair: coin.pair, name: coin.name}, error: null });
});

router.get('/users/:page/:limit', async (req, res) => {
  const page   = parseInt(req.params.page);
  const limit  = parseInt(req.params.limit);
  
  const offset = (page -1) * limit;

  const users = await User.findAndCountAll({limit: limit, offset: offset})

  res.json(
    { data: users.rows, 
      currentPage: page, 
      totalPages: Math.ceil(users.count /limit), 
      error: null 
    });
});



export default router;
