import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const okExt = [".jpg", ".jpeg", ".png", ".webp"];
  const okType = file.mimetype && file.mimetype.startsWith("image/");
  if (okExt.includes(ext) && okType) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, 
});

export default upload;
