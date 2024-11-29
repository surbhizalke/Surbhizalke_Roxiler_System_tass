const Transaction = require("../models/transactionModel");

// Helper to extract month from date
const monthFilter = (month) => ({
  $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
});

// List Transactions with Search and Pagination
const listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;

  const query = {
    ...monthFilter(month),
    ...(search && {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: { $regex: search, $options: "i" } },
      ],
    }),
  };

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const total = await Transaction.countDocuments(query);

    res.json({ transactions, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Statistics
const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const totalSales = await Transaction.aggregate([
      { $match: monthFilter(month) },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const soldCount = await Transaction.countDocuments({
      ...monthFilter(month),
      sold: true,
    });

    const notSoldCount = await Transaction.countDocuments({
      ...monthFilter(month),
      sold: false,
    });

    res.json({
      totalSales: totalSales[0]?.total || 0,
      soldCount,
      notSoldCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bar Chart Data
const getBarChart = async (req, res) => {
  const { month } = req.query;

  const priceRanges = [
    { range: "0-100", min: 0, max: 100 },
    { range: "101-200", min: 101, max: 200 },
    { range: "201-300", min: 201, max: 300 },
    { range: "301-400", min: 301, max: 400 },
    { range: "401-500", min: 401, max: 500 },
    { range: "501-600", min: 501, max: 600 },
    { range: "601-700", min: 601, max: 700 },
    { range: "701-800", min: 701, max: 800 },
    { range: "801-900", min: 801, max: 900 },
    { range: "901+", min: 901, max: Infinity },
  ];

  try {
    const results = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          ...monthFilter(month),
          price: { $gte: min, $lte: max },
        });
        return { range, count };
      })
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pie Chart Data
const getPieChart = async (req, res) => {
  const { month } = req.query;

  try {
    const categories = await Transaction.aggregate([
      { $match: monthFilter(month) },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
};