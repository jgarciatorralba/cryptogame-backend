import express from 'express';

const router = express.Router();

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
