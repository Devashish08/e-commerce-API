/** @format */

// Import necessary modules and functions
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const Review = require("../models/Review");

// Function to create a product
const createProduct = async (req, res) => {
  // Add the user ID to the request body
  req.body.user = req.user.userId;
  // Create the product in the database
  const product = await Product.create(req.body);
  // Respond with the created product
  res.status(StatusCodes.CREATED).json({ product });
};

// Function to get all products
const getAllProduct = async (req, res) => {
  // Fetch all products from the database
  const products = await Product.find({});
  // Respond with the products and their count
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

// Function to get a single product by ID
const getSingleProduct = async (req, res) => {
  // Extract the product ID from the request parameters
  const { id: productId } = req.params;
  // Fetch the product from the database and populate its reviews
  const product = await Product.findOne({ _id: productId }).populate("reviews");
  // If the product is not found, throw an error
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  // Respond with the product
  res.status(StatusCodes.OK).json({ product });
};

// Function to update a product
const updateProduct = async (req, res) => {
  // Extract the product ID from the request parameters
  const { id: productId } = req.params;
  // Update the product in the database and return the updated product
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true
  });
  // Respond with the updated product
  res.status(StatusCodes.OK).json({ product });
};
// Function to delete a product
const deleteProduct = async (req, res) => {
  // Extract the product ID from the request parameters
  const { id: productId } = req.params;
  // Fetch the product from the database
  const product = await Product.findOne({ _id: productId });
  // If the product is not found, throw an error
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  // Remove the product from the database
  await product.remove();
  // Respond with a success message
  res.status(StatusCodes.OK).json({ msg: "Success Product Removed" });
};

// Function to upload an image for a product
const uploadImage = async (req, res) => {
  // If no file is uploaded, throw an error
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  // Extract the image from the uploaded files
  const productImage = req.files.image;
  // If the file is not an image, throw an error
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("please upload image");
  }
  // Define the maximum size for the image
  const maxSize = 1024 * 1024;
  // If the image is too large, throw an error
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("please upload image less than 1MB");
  }
  // Define the path for the image
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  // Move the image to the defined path
  await productImage.mv(imagePath);
  // Respond with the path of the image
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

// Export the controller functions
module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
};
