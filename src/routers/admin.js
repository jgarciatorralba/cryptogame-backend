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
  res.json({ data: coinId, error: null });
});

export default router;
