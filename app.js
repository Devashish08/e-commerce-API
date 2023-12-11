/** @format */

// Load environment variables from .env file
require("dotenv").config();

// Enable global error handling for async functions
require("express-async-errors");

// Import necessary modules
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./db/connect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoute");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const rateLimiter = require("express-rate-limit");
const xss = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddlerWare = require("./middleware/error-handler");

// Initialize Express app
const app = express();

// Use morgan for logging HTTP requests
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);
app.use(xss());
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());
// Define a simple route for the root URL ("/")

// Use the auth routes for all requests to "/api/v1/auth"
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);

// Use custom middleware for handling 404 errors and other errors
app.use(notFoundMiddleWare);
app.use(errorHandlerMiddlerWare);

// Get port from environment variables or use 5000 as a default
const port = process.env.PORT || 5000;

// Start the server and connect to the database
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
