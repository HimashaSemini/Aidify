import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  getSubmittedDonations,
  scheduleDonation,
  getScheduledDonations,
  markAsReceived,
  getReceivedDonations,
  getInTransitDonations,
  markAsTransit,
  markAsDelivered, 
  getDeliveredDonations
} from "../controllers/adminDonationController.js";
import { cancelDonation } from "../controllers/adminDonationController.js";

const router = express.Router();

router.get(
  "/submitted",
  authenticate,
  authorizeRole("admin"),
  getSubmittedDonations
);

router.put(
  "/:id/schedule",
  authenticate,
  authorizeRole("admin"),
  scheduleDonation
);

router.put(
  "/:id/cancel",
  authenticate,
  authorizeRole("admin"),
  cancelDonation
);


router.get(
  "/scheduled",
  authenticate,
  authorizeRole("admin"),
  getScheduledDonations
);

router.put(
  "/:id/receive",
  authenticate,
  authorizeRole("admin"),
  markAsReceived
);

router.get(
  "/received",
  authenticate,
  authorizeRole("admin"),
  getReceivedDonations
);

router.put(
  "/:id/transit",
  authenticate,
  authorizeRole("admin"),
  markAsTransit
);

router.get(
  "/in-transit",
  authenticate,
  authorizeRole("admin"),
  getInTransitDonations
);

router.get(
  "/delivered",
  authenticate,
  authorizeRole("admin"),
  getDeliveredDonations
);

router.put(
  "/:id/delivered",
  authenticate,
  authorizeRole("admin"),
  markAsDelivered
);

export default router;
