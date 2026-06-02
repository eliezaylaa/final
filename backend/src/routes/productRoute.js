const express = require("express");
const router = express.Router();
const {
  GetAllProducts,
  GetProduct,
  addProduct,
  updateProduct,
} = require("../controllers/productController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, GetAllProducts);
router.get(":id/", authenticate, admin, GetProduct);
router.post("/", authenticate, admin, addProduct);
router.put("/:id", authenticate, admin, updateProduct);

module.exports = router;
