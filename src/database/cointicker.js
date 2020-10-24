import WebSocket from 'ws';
import Stock from '../models/stock.js';

export default {
  watch: async function () {
    const symbols = (await Stock.findAll()).map(s => s.symbol);
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    ws.on('message', data => {
      JSON.parse(data).map(coin => {
        if (symbols.includes(coin.s)) {
          Stock.update({
            price: coin.c,
            change: coin.P,
            high: coin.h,
            low: coin.l,
            volume: coin.v,
            trades: coin.n
          }, { where: { symbol: coin.s } });
        }
      });
    });
  }
};
