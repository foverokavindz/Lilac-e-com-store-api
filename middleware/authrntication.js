const jwt = require('jsonwebtoken');
require('dotenv').config();
// route handlers walin authorize person kenekda blnwa me changes krnne
// ekt me funtion eka handles wlin access krnawa

const protect = function (req, res, next) {
  // first check is there a token
  const token = req.header('x-auth-token');
  // const token = req.cookies.access_token;

  if (!token) return res.status(401).send('Access denied. No token provided');

  //then see is it valid?
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded; // == req.user._id // methanin gnne payload eka
    next();
  } catch (ex) {
    res.status(400).send('invalid token');
  }
};

const admin = function (req, res, next) {
  const token = req.header('x-auth-token');
  // const token = req.cookies.access_token;

  if (!token) return res.status(401).send('Access denied. No token provided');

  //then see is it valid?
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded; // == req.user._id // methanin gnne payload eka
    if (req.user.role !== 'admin')
      return res.status(403).send('Access Denied. Not Admin User');
    next();
  } catch (ex) {
    res.status(400).send('invalid token');
  }
};

module.exports = { protect };
