import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, managerOrAdmin, getUsers);

export default router;
