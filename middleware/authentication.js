/** @format */

// Import necessary modules and functions
const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

// Middleware function to authenticate a user
const authenticateUser = async (req, res, next) => {
  // Extract the token from the signed cookies in the request
  const token = req.signedCookies.token;

  // If there is no token, throw an error
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
  try {
    // Validate the token and extract the user's name, ID, and role
    const { name, userId, role } = isTokenValid({ token });
    // Attach the user's details to the request
    req.user = { name, userId, role };
    // Pass control to the next middleware function
    next();
  } catch (error) {
    // If an error occurs, throw an error
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
};

// Middleware function to authorize a user based on their role
const authorizePermissions = (...roles) => {
  // Return a middleware function
  return (req, res, next) => {
    // If the user's role is not included in the provided roles, throw an error
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizeError("You don't have permission");
    }
    // Pass control to the next middleware function
    next();
  };
};

// Export the middleware functions
module.exports = {
  authenticateUser,
  authorizePermissions
};
