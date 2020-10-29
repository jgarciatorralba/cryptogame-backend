import express from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import config from '../config/app-config.js';
import nodemailer from 'nodemailer';
import resetMiddleware from '../middlewares/reset.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  if (req.body.email == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing email attribute' });
  }

  if (req.body.password == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing password attribute' });
  }

  if (req.body.name == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing name attribute' });
  }

  const user = {
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, config.app.saltRounds),
    name: req.body.name,
    balance: config.app.initialBalance
  };

  try {
    await User.create(user);
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
      const duplicateKey = error.errors[0].path;
      if (duplicateKey === 'email')
        return res.status(400).json({ data: null, error: 'Email already taken' });
      if (duplicateKey === 'name')
        return res.status(400).json({ data: null, error: 'Username already taken' });
    }
    return res.status(500).json({ data: null, error: 'Internal Server Error' });
  }

  res.json({ data: 'Congratulation, you have successfully registered!', error: null });
});

router.post('/login', async (req, res) => {
  const credentials = req.body;

  if (credentials.email == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing email attribute' });
  }

  if (credentials.password == null) {
    return res
      .status(400)
      .json({ data: null, error: 'Bad Request: Missing password attribute' });
  }

  const user = await User.findOne({ where: { email: credentials.email } });
  if (user == null) return res.status(400).json({ data: null, error: 'Email doesn\'t exists' });

  const match = await bcrypt.compare(credentials.password, user.password);
  if (!match) return res.status(400).json({ data: null, error: 'Incorrect password' });

  const accessToken = jwt.sign({ id: user.user_id, role: user.role }, config.app.accessTokenSecret);

  const data = {
    accessToken: accessToken,
    user: {
      email: user.email,
      name: user.name,
      avatar: user.avatar ? 'http://' + path.posix.join(config.app.serverDomain, 'avatar', user.avatar) : null,
      role: user.role,
      walletBalance: user.balance,
      walletEstimated: user.estimated,
      walletTotal: user.balance + user.estimated,
      mostBought: 'Bitcoin',
      mostBoughtSymbol: 'BTC',
      ranking: user.ranking
    }
  };

  res.json({ data: data, error: null });
});

router.post('/password/forgot', async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ where: { email: email } });
  if (user == null) return res.status(400).json({ data: null, error: 'Email doesn\'t exists' });

  const resetToken = jwt.sign({ id: user.user_id }, config.app.resetTokenSecret, {expiresIn: '1h'});

  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "47a83c571978c6",
      pass: "2140eb382e5def"
    }
  });

  const emailData = {
    from: 'noreply@cryptogame.com',
    to: email,
    subject: 'Reset password',
    html: `
      <h2>Reset your password</h2>
      <a href='http://${config.app.clientDomain}/newpassword?token=${resetToken}'>Reset password token: ${resetToken}</a>`
  }

  transporter.sendMail(emailData, (error, info) => {
    if (error) {
        return console.log(error);
    }
    res.json({msg:'Email has been sent'});
  });  
});

router.post('/password/reset', resetMiddleware, async (req, res) => {

  try {
    await User.update({password: await bcrypt.hash(req.body.password, config.app.saltRounds)}, {where : {user_id: req.user.id}});
    res.json({data: "Email updated", error: null})
  } catch(error) {
    console.log(error)
  }

});



export default router;
