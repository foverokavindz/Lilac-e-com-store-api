const asyncHandler = require('express-async-handler');
const { Product, validate } = require('../models/product');
const { Category } = require('../models/category');
const { User } = require('../models/user.model');

// tested -working
const displayAllproducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort('name');
  res.send(products);
});

// tested -working
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// not tested
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product was removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// tested -working
const addNewProduct = asyncHandler(async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  const {
    name,
    description,
    price,
    category,
    image,
    images,
    brand,
    isFeatured,
    stock,
  } = req.body;

  // const stock = Number(req.body.stock);

  const product = await Product.create({
    name,
    description,
    price,
    isFeatured,
    brand,
    image,
  });

  product.stock.push(...stock);
  product.images.push(...images);
  product.category.push(...category);

  // Save the product to the database
  const savedProduct = await product.save();

  // after saving product save its id on category table for faster access
  category.map(async (id) => {
    await Category.updateOne(
      { _id: id },
      { $push: { product: savedProduct._id } },
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Category updated successfully:', result);
        }
      }
    );
  });
  // Update the category with the new product ID
  // use await before Promise.all() to make sure that all updates are completed before sending the response.
  // await Promise.all(
  //   category.map(async (categoryObj) => {
  //     const categoryId = categoryObj._id;
  //     await Category.updateOne(
  //       { _id: categoryId },
  //       { $push: { product: product._id } }
  //     );
  //   })
  // );

  // Return the product as response
  res.send(savedProduct);
});

// tested - working
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  //console.log(product);

  if (product) {
    const alreadyReviewed = product.review.find(
      (item) => item.user.toString() === req.user._id.toString()
    );

    console.log('alreadyReviewed   ', alreadyReviewed);
    if (alreadyReviewed)
      return res.status(400).send('Product already reviewed');

    const { firstName, lastName } = await User.findOne({ _id: req.user._id });

    const review = {
      name: firstName + ' ' + lastName,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.review.push(review);

    product.numReviews = product.review.length + 1;

    await product.save();

    res.send(review);
  } else {
    res.send('Product not found');
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    image,
    images,
    brand,
    isFeatured,
    stock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.isFeatured = isFeatured || product.isFeatured;

    // update stock
    // only update count or add new entry or both
    // product.stock = old one and stock = new one
    product.stock.map((oldItem, index) => {
      const newItem = stock.find((item) => item.color === oldItem.color);

      if (newItem) {
        const updatedSizeCount = oldItem.sizeCount.map((oldSize, i) => {
          // new one need to have both size and count to update
          const newSize = newItem.sizeCount.find(
            (size) => size.size === oldSize.size
          );

          if (newSize) {
            return { ...oldSize, count: newSize.count };
          }

          return oldSize;
        });

        //                    // NOTE          methna new array eka thama old ekata replace wenne - wada krnwd kiyl test krnn one
        return { ...oldItem, sizeCount: updatedSizeCount };
      }

      return oldItem;
    });

    // Add new entries from newStock that are not present in oldStock
    stock.forEach((newItem) => {
      if (!product.stock.find((oldItem) => oldItem.color === newItem.color)) {
        product.stock.push(
          newItem.map((item) => {
            return {
              color: item.color,
              sizeCount: item.map((items) => {
                return { size: items.size, count: items.count };
              }),
            };
          })
        );
      }
    });

    // update category

    // Find the differences between oldCategory and newCategory
    const differences = category.filter(
      (newItem) => !product.category.includes(newItem)
    );

    // Update oldCategory with the differences
    if (differences) product.category.push(...differences);

    //check is there new images
    const newImages = images.filter(
      (newImage) => !product.images.includes(newImage)
    );

    if (newImages) product.images.push(...newImages);

    // update the product
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    res.send('Product not found');
  }
});

// tested - working
const getProductByName = asyncHandler(async (req, res) => {
  const name = req.params.name;
  const products = await Product.find({
    name: { $regex: name, $options: 'i' },
  }).populate('category');

  if (!products.length) {
    return res.status(404).send(`No products found for ${name}`);
  }

  res.send(products);
});

//tested - working
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true });

  //console.log('products    ', products);
  if (products.length > 0) {
    res.send(products);
  } else {
    res.status(404).send({ message: 'No featured products found.' });
  }
});

// Update Category // TODO - Not needed for now
// get all products by category name //TODO  - DONE
module.exports = {
  displayAllproducts,
  getProductById,
  deleteProduct,
  addNewProduct,
  addReview,
  updateProduct,
  getProductByName,
  getFeaturedProducts,
};
