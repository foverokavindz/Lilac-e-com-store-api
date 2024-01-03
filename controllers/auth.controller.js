const asyncHandler = require('express-async-handler');
const { User, validateUser } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signUp = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('Email already exists');

  const { firstName, lastName, phone, address, city, email, role } = req.body;

  let { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  // const password = await user.hashPassword(req.body.password);

  user = await User.create({
    firstName,
    lastName,
    phone,
    address,
    city,
    email,
    password,
    role,
  });

  // const token = user.genAuthenticationTkn();

  const { password: hashedPassword, ...rest } = user._doc;

  res.status(200).json(rest);

  //res.header('x-auth-token', token).send({ ...user._doc });
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send('Please Enter Email And Password');

  const user = await User.findOne({ email }).select('+password');

  if (!user) return res.status(400).send('Invalid Email or Password');

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched)
    return res.status(400).send('Invalid Email or Password');

  const token = user.genAuthenticationTkn();

  // fixed bug
  const { password: hashPassword, ...rest } = user._doc;

  // BUG - Log weddi okkoma details send wenawa
  //res.header('x-auth-token', token).send(rest);

  res.header('x-auth-token', token).status(200).json(rest);

  // const expiryDate = new Date(Date.now() + 3600000); // 1 hour
  // res
  //   .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
  //   .status(200)
  //   .json(rest);
});

const googleAuth = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);
    //console.log('token', token);

    const { password: hashedPassword, ...rest } = user._doc;
    res.header('x-auth-token', token).status(200).json(rest);
  } else {
    const geneatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(geneatedPassword, 10);
    const names = req.body.name.split(' ');

    // if there is a single name
    if (names.length < 2) {
      names[1] = '';
    }

    const user = await User.create({
      firstName: names[0],
      lastName: names[1],
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.photo,
      phone: 'GOOGLE_USER',
      address: '"GOOGLE_USER"',
      city: 'GOOGLE_USER',
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);
    // console.log('token', token);

    // fixed bug
    const { password: hashPassword, ...rest } = user._doc;

    res.header('x-auth-token', token).status(200).json(rest);

    // const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    // res
    //   .cookie('access_token', token, {
    //     httpOnly: true,
    //     expires: expiryDate,
    //   })
    //   .status(200)
    //   .json(rest);
  }
});

// not functional this route
const signOut = asyncHandler(async (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
});
module.exports = { signUp, signIn, googleAuth, signOut };
