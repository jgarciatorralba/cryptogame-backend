import WebSocket from 'ws';

export default {
  watch: function () {
    const symbols = ['BTCUSDT'];
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    ws.on('message', function incoming(response) {
      const data = JSON.parse(response);
      for (const coin of data) {
        if (symbols.includes(coin.s)) {
          console.log(`${coin.s}: ${coin.b} $`);
        }
      }
    });
  }
};
