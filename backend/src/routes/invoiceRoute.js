const express = require("express");
const router = express.Router();
const {
  createInvoice,
  confirmPayment,
  GetAllInvoices,
} = require("../controllers/invoiceController");
const { authenticate, admin } = require("../middleware/auth");
router.get("/", authenticate, admin, GetAllInvoices);
router.post("/", authenticate, createInvoice);
router.post("/confirm", authenticate, confirmPayment);

module.exports = router;
