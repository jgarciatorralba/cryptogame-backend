import sequelize from 'sequelize';
import DataTypes from 'sequelize';
import connection from '../database/connection.js';

class Stock extends sequelize.Model { };

Stock.init({
  stock_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  pair: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  change: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  high: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  low: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  volume: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  trades: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize: connection,
  paranoid: true,
  deletedAt: 'destroyTime',
  modelName: 'stock'
});

export default Stock;
