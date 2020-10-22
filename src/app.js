import express from 'express';
import jwt from 'jsonwebtoken';

import config from './config/app-config.js';

const app = express();

app.use(express.json());

const posts = [
  { username: 'Chris', title: 'Post 1' },
  { username: 'Yulia', title: 'Post 2' }
];

app.get('/posts', authMiddleware, (req, res, next) => {
  res.json({ user: req.user, posts });
  next();
}, (req, res) => {
  console.log('final function');
});

app.post('/login', (req, res) => {
  // Auth user
  const username = req.body.username;

  const accessToken = jwt.sign({ name: username }, config.app.accessTokenSecret);
  res.json({ accessToken });
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.app.accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(config.app.port);
