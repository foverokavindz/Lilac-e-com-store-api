const users = require('../routes/user.routes.js');
const auth = require('../routes/auth.routes.js');
const product = require('../routes/products.routes.js');
const category = require('../routes/categories.routes.js');
const cart = require('../routes/cart.routes.js');
const order = require('../routes/orders.routes.js');

module.exports = function (app) {
  app.use('/api/user', users);
  app.use('/api/auth', auth);
  app.use('/api/product', product);
  app.use('/api/category', category);
  app.use('/api/cart', cart);
  app.use('/api/order', order);
};
