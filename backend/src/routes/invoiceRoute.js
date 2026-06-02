const express = require("express");
const router = express.Router();
const { createInvoice } = require("../controllers/invoiceController");
const { authenticate, admin } = require("../middleware/auth");

router.post("/", authenticate, createInvoice);

module.exports = router;
