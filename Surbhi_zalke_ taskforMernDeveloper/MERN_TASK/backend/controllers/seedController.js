import mongoose from "mongoose";
import dotenv from "dotenv";
const axios = require("axios");
const Transaction = require("../models/transactionModel");

const seedDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    // Clear existing data
    await Transaction.deleteMany();

    // Insert new data
    await Transaction.insertMany(response.data);

    res.status(200).json({ message: "Database seeded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { seedDatabase };