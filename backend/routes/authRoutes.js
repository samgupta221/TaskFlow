import express from 'express';
import { check } from 'express-validator';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  socialLogin,
  getUsers,
} from '../controllers/authController.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authUser
);

router.post('/logout', logoutUser);
router.post('/social-login', socialLogin);
router.get('/users', protect, getUsers);
router.get('/profile', protect, getUserProfile);

export default router;
