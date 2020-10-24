import User from '../models/user.js';
import Stock from '../models/stock.js';
import Transaction from '../models/transaction.js';
import Wallet from '../models/wallet.js';

await User.sync();
await Stock.sync();
await Transaction.sync();
await Wallet.sync();

const coins = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'LTCUSDT', name: 'Litecoin' },
  { symbol: 'BCHUSDT', name: 'Bitcoin Cash' },
  { symbol: 'XRPUSDT', name: 'Ripple' },
  { symbol: 'EOSUSDT', name: 'EOS' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'TRXUSDT', name: 'Tron' },
  { symbol: 'XMRUSDT', name: 'Monero' },
  { symbol: 'BNBUSDT', name: 'Binance Coin' },
  { symbol: 'NEOUSDT', name: 'NEO' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' }
];

for (const coin of coins) {
  Stock.create({ symbol: coin.symbol, name: coin.name });
}