import { Router } from 'express';
import { getAllUsers, getAllDonations, createAdmin, getAdminlist } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
const router = Router();

router.get('/users', authenticate, authorizeRole(['admin']), getAllUsers);
router.get('/donations', authenticate, authorizeRole(['admin']), getAllDonations);

router.post('/create-admin', authenticate, authorizeRole('admin'), createAdmin);
router.get( '/list', authenticate, authorizeRole('admin'), getAdminlist);

export default router;
