import sequelize from 'sequelize';
import DataTypes from 'sequelize';
import connection from '../database/connection.js';
import Stock from './stock.js';

class Ticker extends sequelize.Model { };

Ticker.init({
  stock_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: connection,
  modelName: 'ticker'
});

Ticker.belongsTo(Stock, { foreignKey: 'stock_id' });

export default Ticker;
