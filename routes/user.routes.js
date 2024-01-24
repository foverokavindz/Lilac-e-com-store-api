const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  updateUser,
  deleteUser,
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  getUserCount,
} = require('../controllers/user.controller');

router.route('/update').put(protect, updateUser);
router.route('/delete/:id').delete(protect, deleteUser);
router.route('/count').get(getUserCount);
router.route('/myprofile').get(protect, getUserProfile);
router.route('/allusers').get(protect, getAllUsers);
router.route('/:id').get(protect, getUserById);
router.route('/changerole/:id').put(protect, updateUserRole);

module.exports = router;
