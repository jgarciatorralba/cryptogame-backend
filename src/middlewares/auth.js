import jwt from 'jsonwebtoken';
import config from '../config/app-config.js';

export default function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res
      .status(401)
      .json({ data: null, error: 'Unauthorized: Missing JWT' });
  }

  jwt.verify(token, config.app.accessTokenSecret, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ data: null, error: 'Forbidden: Invalid JWT' });
    }

    req.user = user;
    next();
  });
}