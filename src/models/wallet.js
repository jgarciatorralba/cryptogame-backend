import sequelize from 'sequelize';
import DataTypes from 'sequelize';
import connection from '../database/connection.js';
import User from '../models/user.js';
import Stock from './stock.js';

class Wallet extends sequelize.Model { };

Wallet.init({
  wallet_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stock,
      key: 'stock_id'
    }
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize: connection,
  modelName: 'wallet'
});

Wallet.belongsTo(User, { foreignKey: 'user_id' });
Wallet.belongsTo(Stock, { foreignKey: 'stock_id' });

export default Wallet;
