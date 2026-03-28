import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/profiles",
  filename: (req, file, cb) => {
  cb(
    null,
    `user_${req.user.user_id}_${Date.now()}${path.extname(file.originalname)}`
  );
}
});

export const uploadProfile = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
