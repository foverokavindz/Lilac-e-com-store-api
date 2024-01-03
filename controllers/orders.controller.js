const asyncHandler = require('express-async-handler');
const Order = require('../models/order');

const addOrderPoducts = asyncHandler(async (req, res) => {
  const { userId, orderItems, address, total } = req.body;

  if (!orderItems) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = await new Order({
      user: userId,
      address: address,
    });

    order.orderItems.push(...orderItems);
    order.updateItemTotal();
    order.updateAllTotal();

    const createdOrder = await order.save();

    res.send(createdOrder);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.send(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id });
  res.json(orders);
});

const getOrdersAll = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

const chnageOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// not functional
// const updateOrderToDelivered = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = Date.now();

//     const updatedOrder = await order.save();

//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });

module.exports = {
  addOrderPoducts,
  getOrderById,
  getMyOrders,
  getOrdersAll,
  chnageOrderStatus,
  //updateOrderToDelivered,
};
