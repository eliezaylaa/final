const express = require("express");
const router = express.Router();
const {
  createInvoice,
  confirmPayment,
} = require("../controllers/invoiceController");
const { authenticate, admin } = require("../middleware/auth");

router.post("/", authenticate, createInvoice);
router.post("/confirm", authenticate, confirmPayment);

module.exports = router;
