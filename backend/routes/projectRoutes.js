import express from 'express';
import { check } from 'express-validator';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  addMember,
  removeMember
} from '../controllers/projectController.js';
import { protect, managerOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
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

router
  .route('/:id/members')
  .post(protect, managerOrAdmin, addMember);

router
  .route('/:id/members/:userId')
  .delete(protect, managerOrAdmin, removeMember);

export default router;
