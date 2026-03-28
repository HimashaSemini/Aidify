import express from "express";
import { authenticate} from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  getAllDonors,
  getDashboardStats,
  getDonationTrends,
  getWarehouseStats,
  getTopDonors,
  previewAnalyticsReport,
  downloadAnalyticsReport
} from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.get("/stats", authenticate, authorizeRole("admin"), getDashboardStats);
router.get("/donation-trends", authenticate, authorizeRole("admin"), getDonationTrends);
router.get("/warehouse-stats", authenticate, authorizeRole("admin"), getWarehouseStats);
router.get("/top-donors", authenticate, authorizeRole("admin"), getTopDonors);
router.get("/all-donors", authenticate, authorizeRole("admin"), getAllDonors);
router.get("/report/preview", authenticate, authorizeRole("admin"), previewAnalyticsReport);
router.get("/report/pdf", authenticate, authorizeRole ("admin"), downloadAnalyticsReport);



export default router;
