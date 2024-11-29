import mongoos from "mongoose";
import dotenv from "dotenv";
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  dateOfSale: { type: Date, required: true },
  category: { type: String, required: true },
  sold: { type: Boolean, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
