const express = require('express');
const router = express.Router();
//const { protect, admin } = require('../middleware/authentication.js');
const {
  signUp,
  signIn,
  googleAuth,
} = require('../controllers/auth.controller.js');

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/google').post(googleAuth);

module.exports = router;
