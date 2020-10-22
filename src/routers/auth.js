import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import config from '../config/app-config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const credentials = req.body;

  const user = await User.findOne({ where: { email: credentials.email } });
  if (user == null) res.statusCode(400);

  const match = await bcrypt.compare(credentials.password, user.password);
  if (!match) res.statusCode(400);

  const accessToken = jwt.sign({ id: user.user_id }, config.app.accessTokenSecret);
  res.json({ accessToken });
});

export default router;
