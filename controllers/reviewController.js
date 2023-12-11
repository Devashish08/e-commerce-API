/** @format */

const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No Product with id ${productId}`);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You have already submitted a review for this product"
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReview = async (req, res) => {
  const reviews = await Review.find({})
    .populate("user", "name")
    .populate({ path: "product", select: "name company price" })
    .sort("-createdAt");
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId }).populate(
    "user",
    "name"
  );
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, comment, rating } = req.body;
  const review = await Review.findOne({ _id: reviewId }).populate(
    "user",
    "name"
  );
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  checkPermission(req.user, review.user._id.toString());
  review.title = title;
  review.comment = comment;
  review.rating = rating;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId }).populate(
    "user",
    "name"
  );
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }
  checkPermission(req.user, review.user._id.toString());
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId })
    .populate("user", "name")
    .sort("-createdAt");
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
