import express from 'express';
import {connect} from './src/database/connection.js';


const app = express();

connect();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);