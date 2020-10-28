
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: './uploads/avatar/',
  filename: function (req, file, cb) {
    cb(null, req.user.id + crypto.randomBytes(3).toString('base64') + path.extname(file.originalname));
  }
});

const limits = { fileSize: 1024 * 1024 * 5 };

const fileFilter = (req, file, cb) => {
  cb(null, (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'));
};

export default multer({ storage, limits, fileFilter });