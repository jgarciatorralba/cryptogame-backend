import express from 'express';
import bcrypt from 'bcrypt';
import authMiddleware from '../middlewares/auth.js';
import User from '../models/user.js';
import config from '../config/app-config.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({ where: { user_id: userId }, attributes: ['user_id', 'email', 'name', 'avatar', 'role', 'balance'] });
  res.json({ data: user, error: null });
});

router.delete('/', async (req, res) => {
  const userId = req.user.id;
  await User.destroy({ where: { user_id: userId } })
  res.json({ data: "User deleted!", error: null });
});

router.patch('/', async (req, res) => {
  const userId = req.user.id;
  const userUpdate = {email: req.body.email, password: await bcrypt.hash(req.body.password, config.app.saltRounds), name: req.body.name };
  await User.update(userUpdate, { where: {user_id: userId} });
  res.json({ data: "User updated!", error: null });
});


export default router;