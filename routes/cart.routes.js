const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  showCart,
  createCart,
  addproduct,
  removeProduct,
  changeQty,
  clearCart,
} = require('../controllers/cart.controller.js');

router
  .route('/')
  .get(protect, showCart)
  .post(
    protect,
    createCart /*NOTE : Meka auto hadenna one User item add krnw withri */
  );
router.route('/addnew/:id').post(protect, addproduct);

router.route('/removeitem/:itemId/:userId').delete(protect, removeProduct);
router.route('/removeitem/:itemId/:userId').put(protect, changeQty);
router.route('/remove/:userId').delete(protect, clearCart);

module.exports = router;
