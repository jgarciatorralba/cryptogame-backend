import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/app-config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  if (req.body.email == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing email attribute' });
  }

  if (req.body.password == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing password attribute' });
  }

  if (req.body.name == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing name attribute' });
  }

  const user = {
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, config.app.saltRounds),
    name: req.body.name,
    balance: config.app.initialBalance
  };

  try {
    await User.create(user);
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
      const duplicateKey = error.errors[0].path;
      if (duplicateKey === 'email')
        return res.status(400).json({ data: null, error: 'Email already taken' });
      if (duplicateKey === 'name')
        return res.status(400).json({ data: null, error: 'Username already taken' });
    }
    return res.status(500).json({ data: null, error: 'Internal Server Error' });
  }

  res.json({ data: 'Congratulation, you have successfully registered!', error: null });
});

router.post('/login', async (req, res) => {
  const credentials = req.body;

  if (credentials.email == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing email attribute' });
  }

  if (credentials.password == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing password attribute' });
  }

  const user = await User.findOne({ where: { email: credentials.email } });
  if (user == null) return res.status(400).json({ data: null, error: 'Email doesn\'t exists' });

  const match = await bcrypt.compare(credentials.password, user.password);
  if (!match) return res.status(400).json({ data: null, error: 'Incorrect password' });

  const accessToken = jwt.sign({ id: user.user_id, role: user.role }, config.app.accessTokenSecret);

  const data = {
    accessToken: accessToken,
    user: {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      walletBalance: user.balance,
      walletEstimated: user.estimated,
      walletTotal: user.balance + user.estimated,
      walletChange: 0,
      mostBought: 'Bitcoin',
      mostBoughtSymbol: 'BTC',
      ranking: user.ranking
    }
  };

  res.json({ data: data, error: null });
});

export default router;
