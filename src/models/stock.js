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
  api_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  current_value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: connection,
  modelName: 'stock'
});

Stock.sync();

export default Stock;