import express from 'express';
import bcrypt from 'bcrypt';
import authMiddleware from '../middlewares/auth.js';
import avatarMiddleware from '../middlewares/avatar.js';
import User from '../models/user.js';
import Stock from '../models/stock.js';
import Wallet from '../models/wallet.js';
import Trade from '../models/trade.js';
import config from '../config/app-config.js';
import path from 'path';

const router = express.Router();

router.use(authMiddleware);

// Personal user cRUD
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({ where: { user_id: userId }, attributes: ['user_id', 'email', 'name', 'avatar', 'role', 'balance', 'estimated', 'ranking'] });
  user.avatar = user.avatar ? path.posix.join(config.app.serverDomain, 'avatar', user.avatar) : null;
  res.json({ data: user, error: null });
});

router.patch('/', avatarMiddleware.single('avatar'), async (req, res) => {
  const userUpdate = {};
  if (req.body.email) userUpdate.email = req.body.email;
  if (req.body.password) userUpdate.password = await bcrypt.hash(req.body.password, config.app.saltRounds);
  if (req.body.name) userUpdate.name = req.body.name;
  if (req.file) userUpdate.avatar = req.file.filename;
  await User.update(userUpdate, { where: { user_id: req.user.id } });
  res.json({ data: 'User updated!', error: null });
});

router.delete('/', async (req, res) => {
  const userId = req.user.id;
  await User.destroy({ where: { user_id: userId } });
  res.json({ data: "User deleted!", error: null });
});

// Personal user wallet informat
router.get('/wallet', async (req, res) => {
  const user_id = req.user.id;
  const coins = [];
  const wallet = await Wallet.findAll({ where: { user_id }, include: [{ model: Stock, as: 'stock' }] });

  for (const position of wallet) {
    const symbol = position.stock.symbol;
    const quantity = position.quantity;
    const price = position.stock.price;
    const value = quantity * price;
    coins.push({ symbol, quantity, price, value });
  }

  const balance = await User.findOne({ where: { user_id }, attributes: ['balance'] });
  const totalCoinsValue = coins.reduce((total, coin) => total + coin.value, 0);

  res.json({
    data: {
      coins: coins,
      value: totalCoinsValue,
      balance: balance.dataValues.balance,
      total: balance.dataValues.balance + totalCoinsValue
    },
    error: null
  });
});

router.get('/wallet/:coin', async (req, res) => {
  const user_id = req.user.id;
  const symbol = req.params.coin.toUpperCase();
  const stock = await Stock.findOne({ where: { symbol }, attributes: ['stock_id'] });
  if (stock == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Invalid coin symbol' });
  }
  const stock_id = stock.stock_id;
  const wallet = await Wallet.findOne({ where: { user_id, stock_id }, attributes: ['quantity'] });
  const quantity = wallet == null ? 0 : wallet.quantity;
  res.json({ data: { symbol, quantity }, error: null });
});

// Personal user buy and sell endpoints
router.post('/buy', async (req, res) => {
  if (req.body.symbol == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing symbol attribute' });
  }

  if (req.body.quantity == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing quantity attribute' });
  }

  const quantity = parseFloat(req.body.quantity);

  if (isNaN(quantity)) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Invalid quantity value' });
  }

  const stock = await Stock.findOne({ where: { symbol: req.body.symbol } });

  if (stock == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Invalid coin symbol ' + req.body.symbol });
  }

  const user = await User.findByPk(req.user.id);
  const value = quantity * stock.price;

  user.balance -= value;
  if (user.balance < 0) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Not enough funds' });
  }
  await user.save();

  const wallet = await Wallet.findOne({ where: { user_id: user.user_id, stock_id: stock.stock_id } });
  if (wallet == null) {
    await Wallet.create({ user_id: user.user_id, stock_id: stock.stock_id, quantity: quantity });
  } else {
    wallet.quantity += quantity;
    await wallet.save();
  }

  await Trade.create({
    user_id: user.user_id,
    stock_id: stock.stock_id,
    type: 'BUY',
    quantity: quantity,
    value: value
  });

  res.json({ data: 'Success!', error: null });
});

router.post('/sell', async (req, res) => {
  if (req.body.symbol == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing symbol attribute' });
  }

  if (req.body.quantity == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing quantity attribute' });
  }

  const quantity = parseFloat(req.body.quantity);

  if (isNaN(quantity)) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Invalid quantity value' });
  }

  const stock = await Stock.findOne({ where: { symbol: req.body.symbol } });

  if (stock == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Invalid coin symbol ' + req.body.symbol });
  }

  const user = await User.findByPk(req.user.id);

  const wallet = await Wallet.findOne({ where: { user_id: user.user_id, stock_id: stock.stock_id } });

  if (wallet == null || wallet.quantity < quantity) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Not enough funds' });
  }

  wallet.quantity -= quantity;
  if (wallet.quantity === 0) await wallet.destroy();
  else await wallet.save();

  const value = quantity * stock.price;
  user.balance += value;
  await user.save();

  await Trade.create({
    user_id: user.user_id,
    stock_id: stock.stock_id,
    type: 'SELL',
    quantity: quantity,
    value: value
  });

  res.json({ data: 'Success!', error: null });
});

export default router;
