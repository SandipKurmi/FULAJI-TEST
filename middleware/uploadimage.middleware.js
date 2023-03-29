import multer, { diskStorage } from "multer";
import uniqid from "uniqid";
import { extname } from "path";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + uniqid() + extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default upload;
