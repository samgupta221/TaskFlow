import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { validationResult } from 'express-validator';

// @desc    Get all tasks for a user (assigned to them or in their projects)
// @route   GET /api/tasks/all
// @access  Private
const getAllTasks = async (req, res, next) => {
  try {
    let tasks;
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      tasks = await Task.find({}).populate('project', 'name');
    } else {
      // Find projects owned by user
      const userProjects = await Project.find({ user: req.user._id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      
      tasks = await Task.find({
        $or: [
          { project: { $in: projectIds } },
          { assignee: req.user._id }
        ]
      }).populate('project', 'name');
    }
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignee', 'name email');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { title, description, project, assignee, status, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      project,
      assignee,
      status,
      priority,
      dueDate,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignee, status, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.assignee = assignee !== undefined ? assignee : task.assignee;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getAllTasks, getTasks, createTask, updateTask, deleteTask };
