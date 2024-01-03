const asyncHandler = require('express-async-handler');
const { User } = require('../models/user.model');

// Login the user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const { firstName, lastName, city, phone, address, profilePicture } =
    req.body;

  if (user) {
    user.firstName = firstName || user.firstName.trim();
    user.lastName = lastName || user.lastName.trim();
    user.city = city || user.city.trim();
    user.phone = phone || user.phone.trim();
    user.address = address || user.address.trim();
    user.profilePicture = profilePicture || user.profilePicture;
    // user.role = role; - not allowed to change roll. Admin only

    const updatedUser = await user.save();

    const { password, ...rest } = updatedUser._doc;
    res.send(rest);
  } else {
    res.status(404).json({ success: false, message: 'User is not Updated' });
  }
});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(204).json({ message: 'User deleted successfully' });
});

// Get user Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Get all Users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('name');
  res.send(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Chnage user system role - Customer - Admin - Operator
//NOTE
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role;
    const updatedUser = await user.save();
    res.status(200).json(updatedUser.role);
  } else {
    res.status(404).json({ success: false, message: 'User is not Updated' });
  }
});

module.exports = {
  updateUser,
  deleteUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
};
