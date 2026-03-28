import { Router } from "express";
import { submitContactMessage, getAllContactMessages } from "../controllers/contactController.js";

const router = Router();

router.post("/", submitContactMessage);
router.get("/", getAllContactMessages);

export default router;
