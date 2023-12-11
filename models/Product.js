/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50
    },
    price: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
      minlength: 10,
      maxlength: 500
    },
    images: {
      type: String,
      default: "/uploads/example.jpeg"
    },
    category: {
      type: String,
      required: [true, "Please provide category"],
      enum: ["office", "kitchen", "bedroom"]
    },
    company: {
      type: String,
      required: [true, "Please provide company"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported"
      }
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: [true, "Please provide colors"]
    },
    featured: {
      type: Boolean,
      default: false
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    inventory: {
      type: Number,
      min: 15
    },
    averageRating: {
      type: Number,
      default: 0
    },
    numOfReviews: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
  options: { sort: { createdAt: -1 } },
  match: { rating: { $gte: 5 } }
});

productSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});
module.exports = mongoose.model("Product", productSchema);
