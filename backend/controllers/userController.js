import User from '../models/User.js';

// @desc    Get all users or search users by email
// @route   GET /api/users
// @access  Private (Admin/Manager)
const getUsers = async (req, res, next) => {
  try {
    const keyword = req.query.email
      ? {
          email: {
            $regex: req.query.email,
            $options: 'i',
          },
        }
      : {};

    const users = await User.find({ ...keyword }).select('-password').limit(10);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export { getUsers };
