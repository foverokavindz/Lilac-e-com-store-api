const jwt = require('jsonwebtoken');
const { errorHandler } = require('./error');
require('dotenv').config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'You are not authenticated!'));

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, user) => {
    if (err) return next(errorHandler(403, 'Token is not valid!'));

    req.user = user;
    next();
  });
};
