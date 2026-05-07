import express from 'express';
import { check } from 'express-validator';
import {
  getAllTasks,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('project', 'Project ID is required').not().isEmpty(),
    ],
    createTask
  );

router.route('/all').get(protect, getAllTasks);

router.route('/:projectId').get(protect, getTasks);

router
  .route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
