import { Router } from "express";
import { getMyNotifications, markAsRead } from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, getMyNotifications);
router.put("/:id/read", authenticate, markAsRead);

export default router;
