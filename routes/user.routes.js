const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authrntication');
const { updateUser, deleteUser } = require('../controllers/user.controller');

router.route('/update/:id').put(protect, updateUser);
router.route('/delete/:id').delete(protect, deleteUser);

module.exports = router;
