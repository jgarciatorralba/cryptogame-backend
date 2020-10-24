import connection from './connection.js';
import User from '../models/user.js';
import Stock from '../models/stock.js';
import Transaction from '../models/transaction.js';
import Wallet from '../models/wallet.js';

await connection.drop();
await connection.sync();

// insert users
const users = [
  { email: 'admin', password: '$2b$12$m6eJeEa65Xnd3sjzxexj0.hQMvGfwTOiVbIJgSneKIITUYoEO8qQu', name: 'admin', role: 1 }
].forEach(user => User.create(user));

// insert coins
const coins = [
  { symbol: 'BTC', pair: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETH', pair: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'LTC', pair: 'LTCUSDT', name: 'Litecoin' },
  { symbol: 'BCH', pair: 'BCHUSDT', name: 'Bitcoin Cash' },
  { symbol: 'XRP', pair: 'XRPUSDT', name: 'Ripple' },
  { symbol: 'EOS', pair: 'EOSUSDT', name: 'EOS' },
  { symbol: 'ADA', pair: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'TRX', pair: 'TRXUSDT', name: 'Tron' },
  { symbol: 'XMR', pair: 'XMRUSDT', name: 'Monero' },
  { symbol: 'BNB', pair: 'BNBUSDT', name: 'Binance Coin' },
  { symbol: 'NEO', pair: 'NEOUSDT', name: 'NEO' },
  { symbol: 'DOGE', pair: 'DOGEUSDT', name: 'Dogecoin' }
].forEach(coin => Stock.create(coin));

// insert wallets
const wallets = [
  { user_id: 1, stock_id: 1, quantity: 0.123 },
  { user_id: 1, stock_id: 2, quantity: 5.436 },
  { user_id: 1, stock_id: 3, quantity: 10.91 },
  { user_id: 1, stock_id: 12, quantity: 420 }
].forEach(wallet => Wallet.create(wallet));

// insert transactions
const transactions = [
  { user_id: 1, stock_id: 1, type: 'BUY', quantity: 0.123, value: 13114.3 },
  { user_id: 1, stock_id: 2, type: 'BUY', quantity: 5.436, value: 2.6538 },
  { user_id: 1, stock_id: 3, type: 'SELL', quantity: 10.91, value: 412.1 },
  { user_id: 1, stock_id: 12, type: 'BUY', quantity: 420, value: 0.0026366 }
].forEach(transaction => Transaction.create(transaction));