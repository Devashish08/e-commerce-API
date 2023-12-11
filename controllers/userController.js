/** @format */

// Import necessary modules and functions
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookieToResponse,
  checkPermission
} = require("../utils");

// Function to get all users
const getAllUsers = async (req, res) => {
  // Fetch all users from the database, excluding their passwords
  const users = await User.find({ role: "user" }).select("-password");
  // Respond with the users
  res.status(StatusCodes.OK).json({ users });
};

// Function to get a single user by ID
const getSingleUser = async (req, res) => {
  // Fetch the user from the database, excluding their password
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  // If the user is not found, throw an error
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  // Check if the user has permission to access the user details
  checkPermission(req.user, user._id);
  // Respond with the user
  res.status(StatusCodes.OK).json({ user });
};

// Function to get the currently authenticated user
const showCurrentUser = async (req, res) => {
  // Respond with the authenticated user
  res.status(StatusCodes.OK).json({ user: req.user });
};

// Function to update a user (currently commented out)
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw new CustomError.BadRequestError("Please provide name and email");
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookieToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
// Function to update a user's name and email
const updateUser = async (req, res) => {
  // Extract the new name and email from the request body
  const { name, email } = req.body;
  // If either the name or email is not provided, throw an error
  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide name and email");
  }
  // Fetch the user from the database
  const user = await User.findOne({ _id: req.user.userId });
  // Update the user's name and email
  user.name = name;
  user.email = email;
  // Save the updated user
  await user.save();
  // Create a new token for the updated user
  const tokenUser = createTokenUser(user);
  // Attach the new token to the response as a cookie
  attachCookieToResponse({ res, user: tokenUser });
  // Respond with the updated user
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Function to update a user's password
const updateUserPassword = async (req, res) => {
  // Extract the old and new passwords from the request body
  const { oldPassword, newPassword } = req.body;
  // If either the old or new password is not provided, throw an error
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  // Fetch the user from the database
  const user = await User.findOne({ _id: req.user.userId });
  // Check if the old password is correct
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  // If the old password is not correct, throw an error
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  // Update the user's password
  user.password = newPassword;
  // Save the updated user
  await user.save();
  // Respond with a success message
  res.status(StatusCodes.OK).json({ msg: "Success! Password updated" });
};

// Export the controller functions
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};
