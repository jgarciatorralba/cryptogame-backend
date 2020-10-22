import express from 'express';
import {sequelize} from './src/database/connection.js';


const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);