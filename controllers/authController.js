/** @format */

// Import necessary modules
const User = require("../models/User"); // User model
const { StatusCodes } = require("http-status-codes"); // HTTP status codes
const CustomError = require("../errors"); // Custom error handler
const { attachCookieToResponse, createTokenUser } = require("../utils"); // JWT creation utility

/**
 * Register a new user
 * @param {Object} req - Express request object, containing user details in the body
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  // Extract user details from request body
  const { email, name, password } = req.body;

  // Check if email already exists in the database
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // Check if this is the first account to determine role
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user"; // First account gets 'admin' role

  const user = await User.create({ name, email, password, role });

  // Create token payload
  const tokenUser = createTokenUser(user);
  attachCookieToResponse({ res, user: tokenUser });
  // Send response with user details
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
/**
 * Login a user
 * @param {Object} req - Express request object, containing user's email and password in the body
 * @param {Object} res - Express response object
 * @returns {Object} - Returns the logged in user with a token attached to the response as a cookie
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);

  attachCookieToResponse({ res, user: tokenUser });

  // Send response with user details
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

/**
 * Logout a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Returns a message indicating the user has been logged out and removes the token cookie
 */
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now())
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

// Export the functions for use in other modules
module.exports = {
  register,
  login,
  logout
};
