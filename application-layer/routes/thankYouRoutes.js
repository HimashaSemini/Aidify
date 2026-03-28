import { Router } from "express";
import { getThankYouMessage } from "../controllers/thankYouController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:donationId", authenticate, getThankYouMessage);

export default router;