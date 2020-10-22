import express from 'express';
import {connectDatabase} from './src/database/connection.js';
import {User} from './src/models/user.js';



const app = express();

connectDatabase();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);