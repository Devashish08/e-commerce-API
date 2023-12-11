/** @format */

// Middleware function to handle requests to non-existent routes
const notFound = (req, res) =>
  // Send a 404 status code and a message
  res.status(404).send("Route does not exist");

// Export the middleware function
module.exports = notFound;
