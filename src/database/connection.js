import Sequelize from 'sequelize';
import config from '../config/app-config.js';

export default new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    dialect: 'mysql',
    logging: false
  }
);