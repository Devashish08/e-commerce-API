/** @format */

// Import the mongoose module
const mongoose = require("mongoose");
// Set the 'strictQuery' option to true to ensure that only existing paths can be used in a query
mongoose.set("strictQuery", true);

// Function to connect to the database
const connectDB = async (url) => {
  try {
    // Attempt to connect to the database
    await mongoose.connect(url, {
      useNewUrlParser: true, // Use the new URL string parser instead of the deprecated one
      useUnifiedTopology: true, // Use the new topology engine instead of the deprecated one
      retryWrites: "true" // Automatically retry write operations upon failure
    });
  } catch (error) {
    // If an error occurs, log it and exit the process with a failure code
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Export the connectDB function
module.exports = connectDB;

// The commented out code below is a simpler version of the connectDB function that doesn't handle errors or set any options

// const mongoose = require("mongoose");

// const connectDB = (url) => {
//   return mongoose.connect(url);
// };

// module.exports = connectDB;
