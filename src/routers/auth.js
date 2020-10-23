import express from 'express';
import User from '../models/user.js';
import Wallet from '../models/wallet.js';
import Transaction from '../models/transaction.js';
import bcrypt from 'bcrypt';
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      await User.create({email: req.body.email, password: hashedPassword, name: req.body.name});
      res.json({data: "Congratulation, you have successfully registered!", error: null});
  } catch(error) {
    if(error.name == "SequelizeUniqueConstraintError") {
      res.status(400).json({data: null, error: "Email already taken"});
    } else {
      res.status(404).json({data: null, error: "Unknown error"});
    }
  } 
})

router.post('/login', (req, res) => {
  // TODO: Auth user
  const credentials = req.body;

  const user = User.getByEmail(credentials.email);

  bcrypt.compare(credentials.password, user.password);

  // End TODO: Auth user
  const accessToken = jwt.sign({ id: user.id }, config.app.accessTokenSecret);
  res.json({ accessToken });
});



export default router;
