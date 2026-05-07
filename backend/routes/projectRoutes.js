import express from 'express';
import { check } from 'express-validator';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getProjects)
  .post(
    protect,
    managerOrAdmin,
    [check('name', 'Name is required').not().isEmpty()],
    createProject
  );

router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, managerOrAdmin, updateProject)
  .delete(protect, managerOrAdmin, deleteProject);

export default router;
