import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

export const uploadBookCover = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('coverImage'); // Must match your form field name