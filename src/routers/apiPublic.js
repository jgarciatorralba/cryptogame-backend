import express from 'express';
import Stock from '../models/stock.js';

const router = express.Router();

router.get('/coins', async (req, res) => {
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
