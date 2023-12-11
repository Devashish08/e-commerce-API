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

// Trust the first proxy
app.set("trust proxy", 1);

// Apply rate limiting to the application
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
);
// Use security middlewares
app.use(xss()); // Protects against cross-site scripting (XSS) attacks
app.use(helmet()); // Sets various HTTP headers to help protect your app
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)
app.use(mongoSanitize()); // Sanitizes user-supplied data to prevent MongoDB Operator Injection

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser(process.env.JWT_SECRET));

// Serve static files from the "public" directory
app.use(express.static("./public"));

// Enable file upload
app.use(fileUpload());

// Use the defined routes for all requests to "/api/v1/*"
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

// Start the application
start();
