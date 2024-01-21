const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authentication.js');
const {
  addOrderPoducts,
  getOrderById,
  getMyOrders,
  getOrdersAll,
  chnageOrderStatus,
  //updateOrderToDelivered,
} = require('../controllers/orders.controller.js');

router.route('/').post(protect, addOrderPoducts).get(protect, getOrdersAll);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, chnageOrderStatus);
//router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
