import multer from 'multer';
import path from 'path';
import { NextFunction, Request } from 'express';

// Type for the file with additional properties
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-cover-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only accept images
const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Configure multer upload
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware for book cover upload
export const uploadBookCover = upload.single('coverImage');

// Middleware to handle file upload errors
// export const handleUploadErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof multer.MulterError) {
//     // A Multer error occurred when uploading
//     return res.status(400).json({
//       message: err.code === 'LIMIT_FILE_SIZE' ? 'File size too large (max 5MB)' : 'File upload error'
//     });
//   } else if (err) {
//     // An unknown error occurred
//     return res.status(400).json({ message: err.message });
//   }
//   next();
// };