const users = require('../routes/user.routes.js');
const auth = require('../routes/auth.routes.js');

module.exports = function (app) {
  app.use('/api/user', users);
  app.use('/api/auth', auth);
};
