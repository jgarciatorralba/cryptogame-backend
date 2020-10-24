import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Stock from '../models/stock.js';
import config from '../config/app-config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    await User.create({ email: req.body.email, password: hashedPassword, name: req.body.name });
    res.json({ data: 'Congratulation, you have successfully registered!', error: null });
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
      res.status(400).json({ data: null, error: 'Email already taken' });
    } else {
      res.status(404).json({ data: null, error: 'Unknown error' });
    }
  }
});

router.post('/login', async (req, res) => {
  const credentials = req.body;

  const user = await User.findOne({ where: { email: credentials.email } });
  if (user == null) res.status(400).json({ data: null, error: 'Email doesn\'t exists' });

  const match = await bcrypt.compare(credentials.password, user.password);
  if (!match) res.status(400).json({ data: null, error: 'Incorrect password' });

  const accessToken = jwt.sign({ id: user.user_id }, config.app.accessTokenSecret);
  const role = user.role;
  res.json({ data: { accessToken, role }, error: null });
});

router.get('/api/coins', async (req, res) => {
  const response = [];
  for (const coin of await Stock.findAll()) {
    response.push({
      symbol: coin.symbol,
      pair: coin.pair,
      name: coin.name,
      price: coin.price,
      change: coin.change,
      high: coin.high,
      low: coin.low,
      volume: coin.volume,
      trades: coin.trades,
      image: `https://static.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`
    });
  }
  res.json(response);
});

export default router;
