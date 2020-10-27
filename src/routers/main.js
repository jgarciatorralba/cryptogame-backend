import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import Stock from '../models/stock.js';
import User from '../models/user.js';
import Wallet from '../models/wallet.js';
import Trade from '../models/trade.js';

const router = express.Router();

router.use(authMiddleware);

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

router.get('/ranking', async (req, res) => {
  const usersRaw = await User.findAll({ order: [['balance', 'DESC']] });
  const users = usersRaw.map(user => {
    return { name: user.name, avatar: user.avatar, balance: user.balance };
  });
  res.json({ data: users, error: null });
});

router.get('/trades', async (req, res) => {
  const tradeRaw = await Trade.findAll({
    order: [['trade_id', 'DESC']],
    include: [{ model: User, as: 'user' },
    { model: Stock, as: 'stock' }]
  });
  const trades = [];

  for (let trade of tradeRaw) {
    trades.push({
      id: trade.trade_id,
      user: trade.user.name,
      symbol: trade.stock.symbol,
      coin: trade.stock.name,
      type: trade.type.toLowerCase(),
      quantity: trade.quantity,
      value: trade.value,
      date: trade.createdAt
    });
  }

  const data = { trades: trades, count: trades.length };
  res.json({ data: data, error: null });
});

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
      .json({ data: null, error: 'Bad Request: Net enough funds' });
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
