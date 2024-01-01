const mongoose = require('mongoose');
const Joi = require('joi');
// const Category = require('./category');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 1024,
    },
    image: {
      type: String,
      default:
        'https://cdn.vectorstock.com/i/1000x1000/65/35/no-picture-icon-editable-line-vector-30386535.webp',
    },

    images: [
      {
        type: String,
      },
    ],

    brand: {
      type: String,
      default: 'No brand',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        // required: true,
      },
    ],

    stock: [
      {
        color: [
          {
            name: { type: String, required: true },
            size: { type: String, required: true },
            count: { type: Number, required: true },
          },
        ],
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },
    review: [
      {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
    numReviews: { type: Number, default: 0 },
  },

  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    image: Joi.string(),
    images: Joi.array().items(Joi.string()),
    brand: Joi.string(),
    price: Joi.number().min(0).required(),
    category: Joi.array().items(Joi.string().required()), // Assuming category is an array of strings (IDs)
    stock: Joi.array().items(
      Joi.object({
        color: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            size: Joi.string().required(),
            count: Joi.number().required(),
          })
        ),
      })
    ),
    isFeatured: Joi.boolean(),
    review: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        rating: Joi.number().required(),
        comment: Joi.string().required(),
        user: Joi.string().required(), // Assuming user is a string (ID)
      })
    ),
    numReviews: Joi.number().default(0),
  });

  return schema.validate(product);
}

module.exports = {
  validate: validateProduct,
  Product: Product,
};
