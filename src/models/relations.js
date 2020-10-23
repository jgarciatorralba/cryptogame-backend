import Wallet from './wallet.js';
import Stock from './stock.js';
import User from './user.js';

Wallet.hasMany(User)
Wallet.hasMany(Stock);

User.belongsTo(Wallet);
Stock.belongsTo(Wallet)


