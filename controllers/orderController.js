/** @format */
// Import necessary modules and functions
const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermission } = require("../utils");

// Fake Stripe API function for creating a payment intent
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

// Function for creating an order
const createOrder = async (req, res) => {
  // Extract items, tax, and shipping fee from the request body
  const { items: cartItems, tax, shippingFee } = req.body;

  // Check if there are items in the cart
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No items in cart");
  }

  // Check if tax and shipping fee are provided
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  // Initialize order items and subtotal
  let orderItems = [];
  let subTotal = 0;

  // Loop through each item in the cart
  for (const item of cartItems) {
    // Find the product in the database
    const dbProduct = await Product.findOne({ _id: item.product });

    // If the product is not found, throw an error
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id ${item.product}`);
    }

    // Extract necessary information from the product
    const { name, price, image, _id } = dbProduct;

    // Create a single order item
    const singleOrderItem = {
      name,
      price,
      image,
      amount: item.amount,
      product: _id
    };

    // Add the order item to the order items array
    orderItems = [...orderItems, singleOrderItem];

    // Add the price of the item to the subtotal
    subTotal += item.amount * price;
  }

  // Calculate the total price
  const total = tax + shippingFee + subTotal;

  // Create a payment intent with the fake Stripe API
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd"
  });

  // Create the order in the database
  const order = await Order.create({
    user: req.user.userId,
    orderItems,
    tax,
    shippingFee,
    subTotal,
    total,
    clientSecret: paymentIntent.client_secret
  });

  // Send the order and client secret as a response
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
// Function to get all orders
const getAllOrders = async (req, res) => {
  // Fetch all orders from the database
  const orders = await Order.find({});
  // Respond with the orders and their count
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

// Function to get a single order by ID
const getSingleOrder = async (req, res) => {
  // Fetch the order from the database using the ID from the request parameters
  const order = await Order.findOne({ _id: req.params.id });
  // If the order is not found, throw an error
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${req.params.id}`);
  }
  // Check if the user has permission to access the order
  checkPermission(req.user.userId, order.user);
  // Respond with the order
  res.status(StatusCodes.OK).json({ order });
};

// Function to get all orders of the current user
const getCurrentUserOrders = async (req, res) => {
  // Fetch all orders of the current user from the database
  const orders = await Order.find({ user: req.user.userId });
  // Respond with the orders and their count
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

// Function to update an order
const updateOrder = async (req, res) => {
  // Fetch the order from the database using the ID from the request parameters
  const order = await Order.findOne({ _id: req.params.id });
  // Extract the payment intent ID from the request body
  const { paymentIntentId } = req.body;
  // If the order is not found, throw an error
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${req.params.id}`);
  }
  // Check if the user has permission to update the order
  checkPermission(req.user.userId, order.user);
  // Update the order's payment intent and status
  order.paymentIntent = paymentIntentId;
  order.status = "paid";
  // Save the updated order to the database
  await order.save();
  // Respond with the updated order
  res.status(StatusCodes.OK).json({ order });
};

// Export the controller functions
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
};
