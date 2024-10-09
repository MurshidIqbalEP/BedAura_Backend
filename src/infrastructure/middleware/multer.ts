import multer, { FileFilterCallback } from "multer";
import path from "path";

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where the files will be stored
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    ); // Appending extension
  },
});


const upload = multer({
  storage: storage,
  
});

export default upload;
