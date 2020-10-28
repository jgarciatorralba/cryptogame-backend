import express from 'express';
import Stock from '../models/stock.js';

const router = express.Router();

router.get('/coins/:page&:limit', async (req, res) => {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);
  const offset = (page - 1) * limit;


  const coins = [];
  const coinsWithPageCount = await Stock.findAndCountAll({limit: limit, offset: offset})
  
  for (const coin of coinsWithPageCount.rows) {
    coins.push({
      id: coin.stock_id,
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
  res.json({ data: coins, currentPage: page, totalPages: Math.ceil(coinsWithPageCount.count / limit), error: null });
});

router.get('/coin/:coin', async (req, res) => {
  const symbol = req.params.coin.toUpperCase();
  const stock = await Stock.findOne({ where: { symbol }, attributes: ['price'] });
  if (stock == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Invalid coin symbol' });
  }
  const price = stock.price;
  res.json({ data: { symbol, price }, error: null });
});

export default router;
