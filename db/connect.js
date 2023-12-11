/** @format */

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connectDB = async (url) => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: "true"
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

// const mongoose = require("mongoose");

// const connectDB = (url) => {
//   return mongoose.connect(url);
// };

// module.exports = connectDB;
