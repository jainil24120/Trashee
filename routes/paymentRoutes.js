const express = require("express");
const { createOrder, verifyPayment, subscriptions } = require("../controllers/razorpayController");
// const router = require("./authRoutes");
const Router = express.Router();


Router.post("/createOrder", createOrder);
Router.post("/verifyPayment",verifyPayment);

module.exports = Router;


