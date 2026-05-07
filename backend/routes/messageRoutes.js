import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:otherUserId', protect, getMessages);
router.post('/', protect, sendMessage);

export default router;
