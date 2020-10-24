import sequelize from 'sequelize';
import DataTypes from 'sequelize';
import connection from '../database/connection.js';

class Stock extends sequelize.Model { };

Stock.init({
  stock_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  sequelize: connection,
  modelName: 'stock'
});



Stock.sync();


export default Stock;