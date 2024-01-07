const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  getAllCategories,
  addnewCategory,
  filterByCategory,
  getProductByName,
} = require('../controllers/categories.controller.js');
/*
router
  .route('/')
  .post(protect, addnewCategory)
  .get(protect, admin, getAllCategories);

  */

router.route('/').post(protect, addnewCategory).get(protect, getAllCategories);
router.get('/name/:name', getProductByName);
router.get('/filter/:name', filterByCategory);

module.exports = router;
