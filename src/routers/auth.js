import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const newEmail = await User.findAll( {where: {email: req.body.email}})
    if (newEmail.length > 0) {
      res.json({success: false, error: "Email already taken"});
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
      await User.create({email: newEmail, password: hashedPassword, name: req.body.name});
      res.json({success: true, message: "Congratulation, you have successfully registered!"});
    }    
  } catch(error) {
    res.json({error: error});
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
