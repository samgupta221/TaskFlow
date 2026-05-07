import Project from '../models/Project.js';
import { validationResult } from 'express-validator';

// @desc    Get all projects (Admin/Manager get all, User gets assigned/owned)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      projects = await Project.find({}).populate('user', 'name email').populate('members', 'name email');
    } else {
      projects = await Project.find({
        $or: [
          { user: req.user._id },
          { members: req.user._id }
        ]
      }).populate('user', 'name email').populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('user', 'name email')
      .populate('members', 'name email');

    if (project) {
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Admin/Manager)
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      user: req.user._id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Admin/Manager)
const updateProject = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.name = name || project.name;
      project.description = description || project.description;
      project.status = status || project.status;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Admin/Manager)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin/Manager)
const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.members.includes(userId)) {
      res.status(400);
      throw new Error('User is already a member');
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(req.params.id).populate('members', 'name email');
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin/Manager)
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    await project.save();

    const updatedProject = await Project.findById(req.params.id).populate('members', 'name email');
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  addMember,
  removeMember
};
