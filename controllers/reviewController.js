/** @format */

// Import necessary modules and functions
const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission } = require("../utils");

// Function to create a review
const createReview = async (req, res) => {
  // Extract the product ID from the request body
  const { product: productId } = req.body;
  // Check if the product exists
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No Product with id ${productId}`);
  }
  // Check if the user has already submitted a review for this product
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You have already submitted a review for this product"
    );
  }
  // Add the user ID to the request body
  req.body.user = req.user.userId;
  // Create the review in the database
  const review = await Review.create(req.body);
  // Respond with the created review
  res.status(StatusCodes.CREATED).json({ review });
};

// Function to get all reviews
const getAllReview = async (req, res) => {
  // Fetch all reviews from the database, populate the user and product details, and sort by creation date
  const reviews = await Review.find({})
    .populate("user", "name")
    .populate({ path: "product", select: "name company price" })
    .sort("-createdAt");
  // Respond with the reviews and their count
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

// Function to get a single review by ID
const getSingleReview = async (req, res) => {
  // Extract the review ID from the request parameters
  const { id: reviewId } = req.params;
  // Fetch the review from the database and populate the user details
  const review = await Review.findOne({ _id: reviewId }).populate(
    "user",
    "name"
  );
  // If the review is not found, throw an error
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  // Respond with the review
  res.status(StatusCodes.OK).json({ review });
};

// Function to update a review
const updateReview = async (req, res) => {
  // Extract the review ID from the request parameters
  const { id: reviewId } = req.params;
  // Extract the updated fields from the request body
  const { title, comment, rating } = req.body;
  // Fetch the review from the database and populate the user details
  const review = await Review.findOne({ _id: reviewId }).populate(
    "user",
    "name"
  );
  // If the review is not found, throw an error
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  // Check if the user has permission to update the review
  checkPermission(req.user, review.user._id.toString());
  // Update the review fields
  review.title = title;
  review.comment = comment;
  review.rating = rating;
  // Save the updated review
  await review.save();
  // Respond with the updated review
  res.status(StatusCodes.OK).json({ review });
};

// Function to delete a review
const deleteReview = async (req, res) => {
  // Extract the review ID from the request parameters
  const { id: reviewId } = req.params;
  // Fetch the review from the database and populate the user details
  const review = await Review.findOne({ _id: reviewId }).populate(
    "user",
    "name"
  );
  // If the review is not found, throw an error
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  // Check if the user has permission to delete the review
  checkPermission(req.user, review.user._id.toString());
  // Remove the review from the database
  await review.remove();
  // Respond with a success message
  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

// Function to get all reviews for a single product
const getSingleProductReviews = async (req, res) => {
  // Extract the product ID from the request parameters
  const { id: productId } = req.params;
  // Fetch all reviews for the product from the database, populate the user details, and sort by creation date
  const reviews = await Review.find({ product: productId })
    .populate("user", "name")
    .sort("-createdAt");
  // Respond with the reviews and their count
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

// Export the controller functions
module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
