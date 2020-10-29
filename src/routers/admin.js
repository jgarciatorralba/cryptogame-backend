import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/admin.js';
import Stock from '../models/stock.js';
import Wallet from '../models/wallet.js';
import User from '../models/user.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

// Coin CRuD
router.post('/coin', async (req, res) => {
  const coin = req.body;
  
  const checkCoin = await Stock.findOne({ where: { name: coin.name}, paranoid: false});

  if(checkCoin && checkCoin.destroyTime == null) {
    res.json({ data: null, error: "Coin already exists!" });
  } else if (checkCoin && checkCoin.destroyTime) {
    await Stock.restore({where: {'stock_id': checkCoin.stock_id}});
    res.json({ data: "Coin restored!", error: null });
  } else {
     await Stock.create(coin);
  res.json({ data: "Coin added!", error: null });
  }
});

router.get('/coin/:coinId', async (req, res) => {
  const coinId = req.params.coinId;
  const coin = await Stock.findOne({ where: { stock_id: coinId } });
  res.json({ data: { symbol: coin.symbol, pair: coin.pair, name: coin.name }, error: null });
});

router.delete('/coin/:coinId', async (req, res) => {
  const coinId = req.params.coinId;
  const coinsInWallets = await Wallet.findAll({where: {'stock_id': coinId}});

  if (coinsInWallets.length>0) {
    res.json({ data: null, error: "Cannot delete coin - some players have it in portfolio" });
  } else {
    await Stock.destroy({ where: { stock_id: coinId }});
  res.json({ data: "Coin soft deleted!", error: null });
  }
});

// User cRUD
router.get('/users/:page&:limit', async (req, res) => {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);
  const offset = (page - 1) * limit;
  const users = await User.findAndCountAll({ attributes: ['user_id', 'email', 'name', 'avatar', 'role', 'balance'], limit: limit, offset: offset });

  res.json(
    {
      data: users.rows,
      currentPage: page,
      totalPages: Math.ceil(users.count / limit),
      error: null
    });
});

router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findOne({ where: { user_id: userId }, attributes: ['user_id', 'email', 'name', 'avatar', 'role', 'balance'] });
  res.json({ data: user, error: null });
});

router.patch('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userUpdate = req.body;
  await User.update(userUpdate, { where: { user_id: userId } });
  res.json({ data: "User updated!", error: null });
});

router.delete('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  await User.destroy({ where: { user_id: userId } });
  res.json({ data: "User soft deleted!", error: null });
});

export default router;
