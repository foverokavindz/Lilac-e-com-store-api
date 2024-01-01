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

const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(204).json({ message: 'User deleted successfully' });
});

module.exports = { updateUser, deleteUser };
