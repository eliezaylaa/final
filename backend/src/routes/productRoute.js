const express = require("express");
const router = express.Router();
const { GetAllProducts } = require("../controllers/productController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, GetAllProducts);

module.exports = router;
