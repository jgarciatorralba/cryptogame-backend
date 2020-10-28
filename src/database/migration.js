import bcrypt from 'bcrypt';
import connection from './connection.js';
import User from '../models/user.js';
import Stock from '../models/stock.js';
import Trade from '../models/trade.js';
import Wallet from '../models/wallet.js';
import config from '../config/app-config.js';

await connection.drop();
await connection.sync();

// insert users
const users = [
  { email: 'admin@admin.com', password: await bcrypt.hash('123456', config.app.saltRounds), name: 'Admin', role: 1, balance: 10000, avatar: '1Gj0d.jpg' },
  { email: 'christian@assemblerschool.com', password: await bcrypt.hash('123456', config.app.saltRounds), name: 'Chris', role: 0, balance: 10000 },
].forEach(user => User.create(user));

// insert coins
const coins = [
  { symbol: 'BTC', pair: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETH', pair: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'XRP', pair: 'XRPUSDT', name: 'Ripple' },
  { symbol: 'BCH', pair: 'BCHUSDT', name: 'Bitcoin Cash' },
  { symbol: 'BNB', pair: 'BNBUSDT', name: 'Binance Coin' },
  { symbol: 'LINK', pair: 'LINKUSDT', name: 'Chainlink' },
  { symbol: 'LTC', pair: 'LTCUSDT', name: 'Litecoin' },
  { symbol: 'ADA', pair: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'EOS', pair: 'EOSUSDT', name: 'EOS' },
  { symbol: 'XMR', pair: 'XMRUSDT', name: 'Monero' },
  { symbol: 'TRX', pair: 'TRXUSDT', name: 'TRON' },
  { symbol: 'XLM', pair: 'XLMUSDT', name: 'Stellar' },
  { symbol: 'XTZ', pair: 'XTZUSDT', name: 'Tezos' },
  { symbol: 'NEO', pair: 'NEOUSDT', name: 'Neo' },
  { symbol: 'ATOM', pair: 'ATOMUSDT', name: 'Cosmos' },
  { symbol: 'ALGO', pair: 'ALGOUSDT', name: 'Algorand' },
  { symbol: 'MIOTA', pair: 'MIOTAUSDT', name: 'IOTA' },
  { symbol: 'DASH', pair: 'DASHUSDT', name: 'Dash' },
  { symbol: 'VET', pair: 'VETUSDT', name: 'VeChain' },
  { symbol: 'ETC', pair: 'ETCUSDT', name: 'Ethereum Classic' },
  { symbol: 'THETA', pair: 'THETAUSDT', name: 'THETA' },
  { symbol: 'ONT', pair: 'ONTUSDT', name: 'Ontology' },
  { symbol: 'TUSD', pair: 'TUSDUSDT', name: 'TrueUSD' },
  { symbol: 'MKR', pair: 'MKRUSDT', name: 'Maker' },
  { symbol: 'FTT', pair: 'FTTUSDT', name: 'FTX Token' },
  { symbol: 'DOGE', pair: 'DOGEUSDT', name: 'Dogecoin' },
  { symbol: 'OMG', pair: 'OMGUSDT', name: 'OMG Network' },
  { symbol: 'WAVES', pair: 'WAVESUSDT', name: 'Waves' },
  { symbol: 'ZEC', pair: 'ZECUSDT', name: 'Zcash' },
  { symbol: 'BAT', pair: 'BATUSDT', name: 'Basic Attention Token' },
  { symbol: 'ZRX', pair: 'ZRXUSDT', name: '0x' },
  { symbol: 'REN', pair: 'RENUSDT', name: 'Ren' },
  { symbol: 'PAX', pair: 'PAXUSDT', name: 'Paxos Standard' },
  { symbol: 'QTUM', pair: 'QTUMUSDT', name: 'Qtum' },
  { symbol: 'DGB', pair: 'DGBUSDT', name: 'DigiByte' },
  { symbol: 'ZIL', pair: 'ZILUSDT', name: 'Zilliqa' },
  { symbol: 'LRC', pair: 'LRCUSDT', name: 'Looping LRC' },
  { symbol: 'KNC', pair: 'KNCUSDT', name: 'Kyber Network' },
  { symbol: 'OCEAN', pair: 'OCEANUSDT', name: 'Ocean Protocol' },
  { symbol: 'DCR', pair: 'DCRUSDT', name: 'Decred' }
].forEach(coin => Stock.create(coin));

// insert wallets
const wallets = [
  { user_id: 1, stock_id: 1, quantity: 0.123 },
  { user_id: 1, stock_id: 2, quantity: 5.436 },
  { user_id: 1, stock_id: 3, quantity: 10.91 },
  { user_id: 1, stock_id: 8, quantity: 10000 },
  { user_id: 2, stock_id: 1, quantity: 0.123 },
  { user_id: 2, stock_id: 2, quantity: 5.436 },
  { user_id: 2, stock_id: 3, quantity: 10.99 },
  { user_id: 2, stock_id: 8, quantity: 10000 }
].forEach(wallet => Wallet.create(wallet));

// insert trades
const trades = [
  { user_id: 1, stock_id: 1, type: 'BUY', quantity: 0.123, value: 13114.3 },
  { user_id: 1, stock_id: 2, type: 'SELL', quantity: 5.43, value: 2.6538 },
  { user_id: 2, stock_id: 3, type: 'BUY', quantity: 10.91, value: 412.1 },
  { user_id: 1, stock_id: 8, type: 'SELL', quantity: 1000, value: 0.0026366 },
  { user_id: 2, stock_id: 1, type: 'BUY', quantity: 0.123, value: 13114.3 },
  { user_id: 1, stock_id: 2, type: 'SELL', quantity: 8.86, value: 2.6538 },
  { user_id: 2, stock_id: 3, type: 'BUY', quantity: 10.91, value: 412.1 },
  { user_id: 2, stock_id: 8, type: 'SELL', quantity: 4200, value: 0.0026366 }
].forEach(trade => Trade.create(trade));