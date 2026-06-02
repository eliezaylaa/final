const express = require("express");
const router = express.Router();
const {
  createInvoice,
  confirmPayment,
  GetAllInvoices,
  GetInvoice,
} = require("../controllers/invoiceController");
const { authenticate, admin } = require("../middleware/auth");
router.get("/", authenticate, admin, GetAllInvoices);
router.get("/:id", authenticate, GetInvoice);
router.post("/", authenticate, createInvoice);
router.post("/confirm", authenticate, confirmPayment);


module.exports = router;
