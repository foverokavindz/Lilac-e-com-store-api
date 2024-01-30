const asyncHandler = require('express-async-handler');
const { Order } = require('../models/order');

const addOrderPoducts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderItems, address } = req.body;

  console.log('userId  ', userId);
  if (!orderItems) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = await Order.create({
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

// admin or user
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.send(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//user
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  //console.log('orders   ', orders);
  res.json(orders);
});

//admin
const getOrdersAll = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate(
    'user',
    'id firstName lastName profilePicture city email'
  );
  res.json(orders);
});

//admin
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

const getOrderCount = asyncHandler(async (req, res) => {
  try {
    // console.log('Before countDocuments');
    const orderCount = await Order.countDocuments({});
    //console.log('After countDocuments');

    // console.log(orderCount);
    res.json(orderCount);
  } catch (error) {
    console.error('Error retrieving order count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getPendingOrdersTotal = asyncHandler(async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ];

    const result = await Order.aggregate(pipeline);

    // Result will be an array with a single object { _id: null, total: <sum> }
    const pendingOrderTotal = result.length > 0 ? result[0].total : 0;

    res.json(pendingOrderTotal);
  } catch (error) {
    console.error('Error retrieving pending order total:', error);
    throw error;
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
  getOrderCount,
  getPendingOrdersTotal,
  //updateOrderToDelivered,
};
