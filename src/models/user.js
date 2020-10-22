import sequelize from 'sequelize';
import DataTypes from 'sequelize';
import connection from '../database/connection.js';

class User extends sequelize.Model { };

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 20000
  }
}, {
  sequelize: connection,
  modelName: 'user'
});

User.sync();

export default User;