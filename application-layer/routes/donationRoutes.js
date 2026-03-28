import express from "express";
import { createDonation, getDonations, getDonorImpact, getTopDonors } from "../controllers/donationController.js";
import { getLatestDonationTracking } from "../controllers/trackingController.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { getMyDeliveredDonations } from "../controllers/donationController.js";

const router = express.Router();

router.post(
  "/create",
  authenticate,
  upload.single("image"),
  createDonation
);

router.get('/', authenticate, getDonations);
router.get('/donor-impact', authenticate, getDonorImpact);
router.get("/leaderboard", authenticate, getTopDonors);
router.get("/my/latest", authenticate, getLatestDonationTracking);
router.get("/my-delivered", authenticate, getMyDeliveredDonations);



export default router;



