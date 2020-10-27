import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import User from '../models/user.js';

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
  const userUpdate = req.body;
  await User.update(userUpdate, { where: {user_id: userId} });
  res.json({ data: "User updated!", error: null });
});


export default router;