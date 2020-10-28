import express from 'express';
import path from 'path';
import authMiddleware from '../middlewares/auth.js';
import Stock from '../models/stock.js';
import User from '../models/user.js';
import Trade from '../models/trade.js';
import config from '../config/app-config.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/ranking', async (req, res) => {
  const usersRaw = await User.findAll({ order: ['ranking'] });
  const users = usersRaw.map(user => {
    return {
      position: user.ranking,
      name: user.name,
      avatar: user.avatar ? path.posix.join(config.app.serverDomain, 'avatar', user.avatar) : null,
      total: user.estimated + user.balance
    };
  });
  res.json({ data: users, error: null });
});

router.get('/trades/:page&:limit', async (req, res) => {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);
  const offset = (page - 1) * limit;

  const tradeRaw = await Trade.findAndCountAll({
    order: [['trade_id', 'DESC']],
    include: [{ model: User, as: 'user' }, { model: Stock, as: 'stock' }],
    limit: limit,
    offset: offset
  });

  const trades = [];

  for (let trade of tradeRaw.rows) {
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

  const data = { trades: trades, count: tradeRaw.count };
  res.json({ data: data, currentPage: page, totalPages: Math.ceil(data.count / limit), error: null });
});

export default router;
