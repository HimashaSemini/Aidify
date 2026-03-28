import express from "express";
import {
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
  nearestWarehouse
} from "../controllers/warehouseController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getWarehouses);
router.post("/", authenticate, authorizeRole("admin"), createWarehouse);
router.put("/:id", authenticate, authorizeRole("admin"), updateWarehouse);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteWarehouse);
router.get("/nearest", nearestWarehouse);


export default router;
