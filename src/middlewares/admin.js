
export default function (req, res, next) {
  if (req.user.role !== 1) {
    return res
      .status(401)
      .json({ data: null, error: 'Unauthorized' });
  }
  next();
}
