const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  displayAllproducts,
  getProductById,
  deleteProduct,
  addNewProduct,
  addReview,
  updateProduct,
  getProductByName,
  getFeaturedProducts,
} = require('../controllers/product.controller.js');

router.route('/').get(displayAllproducts).post(protect, addNewProduct);
router.route('/review/:id').put(protect, addReview);
router.get('/search/:name', getProductByName);
router.route('/featured').get(getFeaturedProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;
