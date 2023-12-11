/** @format */

const mongoose = require("mongoose");
const SingleOrderItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 1
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true
  }
});
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
      }
    ],
    tax: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0.0
    },
    subTotal: {
      type: Number,
      required: true,
      default: 0.0
    },
    total: {
      type: Number,
      required: true,
      default: 0.0
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending"
    },
    clientSecret: {
      type: String,
      required: true
    },
    paymentIntentId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
