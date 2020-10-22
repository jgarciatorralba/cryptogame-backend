import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({path: './.env'})

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  });

sequelize.authenticate()
  .then(()=> console.log('Database connected'))
  .catch((err) => console.log(`Error: ${err}`));

export {sequelize};