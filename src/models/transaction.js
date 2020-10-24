import sequelize from 'sequelize';
import DataTypes from 'sequelize';
import connection from '../database/connection.js';
import User from './user.js';
import Stock from './stock.js';

class Transaction extends sequelize.Model { };

Transaction.init({
  transaction_id: {
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
  type: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  cuantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: connection,
  modelName: 'transaction'
});

Transaction.belongsTo(User, {foreignKey: 'user_id'});
Transaction.belongsTo(Stock, {foreignKey: 'stock_id'});

Transaction.sync();

export default Transaction;