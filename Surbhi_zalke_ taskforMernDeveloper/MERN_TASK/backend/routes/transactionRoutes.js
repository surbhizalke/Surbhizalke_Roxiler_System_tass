const express = require("express");
const {
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/transactions", listTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChart);
router.get("/pie-chart", getPieChart);

module.exports = router;