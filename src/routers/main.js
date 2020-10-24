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
    const transactions = await Transaction.findAll({ include: [{ model: User, as: 'user' }, { model: Stock, as: 'stock' }] });
    let result = [];

    for (let transaction of transactions) {
      result.push({
        id: transaction.transaction_id,
        user: transaction.user.name,
        coin: transaction.stock.name,
        quantity: transaction.quantity,
        value: transaction.value,
        date: transaction.createdAt
      });
    }

    res.json(result);
  } catch (error) {
    res.status(404).json({ data: null, error: 'Unknown error' });
  }
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

  await Transaction.create({
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

  await Transaction.create({
    user_id: user.user_id,
    stock_id: stock.stock_id,
    type: 'SELL',
    quantity: quantity,
    value: value
  });

  res.json({ data: 'Success!', error: null });
});

router.get('/wallet', async (req, res) => {
  try {
    const id = req.user.id;
    let wallet = [];
    let valueOfAssets = 0;
    const walletPositions = await Wallet.findAll({ where: { user_id: id }, include: [{ model: Stock, as: 'stock' }] });

    for (const position of walletPositions) {
      const coin = await Stock.findOne({ where: { stock_id: position.stock_id } });
      wallet.push({ coin: position.stock.symbol, quantity: position.quantity, price: coin.dataValues.price, value: position.quantity * coin.dataValues.price });
      valueOfAssets += position.quantity * coin.dataValues.price;
    }

    const balance = await User.findOne({where: {user_id: id}, attributes: ['balance']});

    wallet.push({estimated_value: valueOfAssets});
    wallet.push({balance: balance.dataValues.balance});
    wallet.push({total: balance.dataValues.balance + valueOfAssets});

    res.json(wallet);

  } catch(error) {
    res.json({ data: null, error: 'Wallet not found!' });;
  } 
});

export default router;
