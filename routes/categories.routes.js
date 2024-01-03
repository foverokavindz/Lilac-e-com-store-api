const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  getAllCategories,
  addnewCategory,
  filterByCategory,
  getProductByName,
} = require('../controllers/categoriesController.js');

router
  .route('/')
  .post(protect, admin, addnewCategory)
  .get(protect, admin, getAllCategories);
router.get('/name/:name', getProductByName);
router.get('/filter//:categoryName', filterByCategory);

module.exports = router;
