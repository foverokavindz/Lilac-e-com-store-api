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
router.route('/reviews/:id').post(protect, addReview);
router.get('/search/:name', getProductByName);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);
router.route('/featured').get(getFeaturedProducts);

module.exports = router;
