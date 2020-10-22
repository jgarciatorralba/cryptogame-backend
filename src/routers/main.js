import express from 'express';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', (req, res) => {
  res.send('Protected profile page');
});

export default router;
