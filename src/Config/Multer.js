import multer from "multer";
import path from "node:path";

// In-memory so req.file.buffer is available for Cloudinary
const storage = multer.memoryStorage();

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB (matches your frontend)

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const okExt = ALLOWED_EXT.has(ext);
  const okType = (file.mimetype || "").startsWith("image/");
  if (okExt && okType) return cb(null, true);

  // Keep message your controller checks for:
  // (createUser catches: error.message.includes("Only image files are allowed"))
  return cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_BYTES, // block >3MB
    files: 1,                 // only one file
  },
});

export default upload;

/**
 * Optional helper to convert Multer errors into clean 400 responses.
 * Use in routes if you want consistent JSON messages.
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image must be ≤ 3 MB" });
    }
    // Fallback for other Multer errors
    return res.status(400).json({ message: err.message || "Upload error" });
  }
  if (err?.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  return next(err);
};
