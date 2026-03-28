import { Router } from 'express';
import { register, login, getMyProfile,
  updateProfile,
  deleteProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { uploadProfile } from '../middleware/uploadProfileMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get("/profile", authenticate, getMyProfile);
router.put(
  "/profile",
  authenticate,
  uploadProfile.single("profile_image"),
  updateProfile
);
router.delete("/profile", authenticate, deleteProfile);


export default router;
