const express = require("express");
const router = express.Router();
const {
  GetAllProducts,
  GetProduct,
} = require("../controllers/productController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, GetAllProducts);
router.get(":id/", authenticate, GetProduct);

module.exports = router;
