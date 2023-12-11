/** @format */

// Import the HTTP status codes
const { StatusCodes } = require("http-status-codes");

// Define the error handling middleware function
const errorHandlerMiddleware = (err, req, res, next) => {
  // Create a custom error object with a default status code and message
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later"
  };

  // If the error is a validation error, update the custom error message and status code
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  // If the error is a duplicate key error, update the custom error message and status code
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  // If the error is a cast error (invalid object ID), update the custom error message and status code
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  // Send the custom error as the response
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

// Export the error handling middleware function
module.exports = errorHandlerMiddleware;
