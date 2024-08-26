import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where the files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" +Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

// // Configure file filter and size limit
// const fileFilter = (req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
//   const fileTypes = /jpeg|jpg|png/;
//   const mimeType = fileTypes.test(file.mimetype);
//   const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimeType && extName) {
//     cb(null, true);
//   } else {
//     cb(new Error('File type not supported!'));
//   }
// };

const upload = multer({
  storage: storage,
  // limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  // fileFilter: fileFilter
});

export default upload;
