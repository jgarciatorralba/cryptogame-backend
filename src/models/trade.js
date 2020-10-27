import sequelize from 'sequelize';
import DataTypes from 'sequelize';
import connection from '../database/connection.js';
import User from './user.js';
import Stock from './stock.js';

class Trade extends sequelize.Model { };

Trade.init({
  trade_id: {
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
      key: 'user_id',
    }
  },
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stock,
      key: 'stock_id',
    }
  },
  type: {
    type: DataTypes.ENUM('BUY', 'SELL'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: connection,
  paranoid: true,
  deletedAt: 'destroyTime',
  modelName: 'trade'
});

Trade.belongsTo(User, { foreignKey: 'user_id' });
Trade.belongsTo(Stock, { foreignKey: 'stock_id' });

export default Trade;

