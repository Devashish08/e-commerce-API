/** @format */

// Import necessary modules and functions
const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

// Middleware function to authenticate a user
const authenticateUser = async (req, res, next) => {
  let token;
  // Check the authorization header for a token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  // If no token in the authorization header, check the cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token is found, throw an error
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
  try {
    // Validate the token and extract the payload
    const payload = isTokenValid(token);

    // Attach the user's ID and role to the request
    req.user = {
      userId: payload.user.userId,
      role: payload.user.role
    };

    // Pass control to the next middleware function
    next();
  } catch (error) {
    // If an error occurs, throw an error
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};

// Middleware function to authorize a user based on their role
const authorizeRoles = (...roles) => {
  // Return a middleware function
  return (req, res, next) => {
    // If the user's role is not included in the provided roles, throw an error
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    // Pass control to the next middleware function
    next();
  };
};

// Export the middleware functions
module.exports = { authenticateUser, authorizeRoles };
