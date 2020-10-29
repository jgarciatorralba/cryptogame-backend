import axios from 'axios';
import Stock from '../models/stock.js';

export default {
  update8h: async function () {
    const coins = await Stock.findAll();
    for (const coin of coins) {
      const apiEndpoint = `https://api.binance.com/api/v3/klines?symbol=${coin.pair}&interval=1m&limit=480`;
      const response = await axios.get(apiEndpoint);
      const data = response.data.map(entry => [entry[0], entry[1]]);
      coin.price8h = data;
      coin.save();
    }
  },
  update24h: async function () {
    const coins = await Stock.findAll();
    for (const coin of coins) {
      const apiEndpoint = `https://api.binance.com/api/v3/klines?symbol=${coin.pair}&interval=3m&limit=480`;
      const response = await axios.get(apiEndpoint);
      const data = response.data.map(entry => [entry[0], entry[1]]);
      coin.price24h = data;
      coin.save();
    }
  },
  update7d: async function () {
    const coins = await Stock.findAll();
    for (const coin of coins) {
      const apiEndpoint = `https://api.binance.com/api/v3/klines?symbol=${coin.pair}&interval=15m&limit=336`;
      const response = await axios.get(apiEndpoint);
      const data = response.data.map(entry => [entry[0], entry[1]]);
      coin.price7d = data;
      coin.save();
    }
  }
};
