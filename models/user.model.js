const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const config = require('config');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      //trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      //trim: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      //trim: true,
    },
    address: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
      trim: true,
      //lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
      //trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'operator', 'admin'],
      default: 'customer',
    },
    profilePicture: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
  },
  { timestamps: true }
);

// generate JWT
userSchema.methods.genAuthenticationTkn = function () {
  // Generate token  jwtSign+payload+Signature
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create user Model with schema
const User = mongoose.model('User', userSchema);

// validate inputs
function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(2).max(20).required(),
    email: Joi.string().min(2).max(50).required(),
    address: Joi.string().min(5).max(255).required(),
    city: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(8).max(12).required(),
    /* role: Joi.string()
      .valid(...userSchema.path('role').enumValues)
      .required(),*/
  });

  return schema.validate(user);
}
module.exports = { User, validateUser };
//exports.validate = validateUser;
