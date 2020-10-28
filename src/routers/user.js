import express from 'express';
import bcrypt from 'bcrypt';
import authMiddleware from '../middlewares/auth.js';
import User from '../models/user.js';
import config from '../config/app-config.js';

import multer from 'multer';
import path from 'path'

const router = express.Router();
router.use(authMiddleware);

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null, req.user.id + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage}).single('avatar');

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

router.patch('/', upload, async (req, res) => {
  const userId = req.user.id;
  const userUpdate = {email: req.body.email, password: await bcrypt.hash(req.body.password, config.app.saltRounds), name: req.body.name };
  await User.update(userUpdate, { where: {user_id: userId} });
  res.json({ data: "User updated!", error: null });
});


export default router;