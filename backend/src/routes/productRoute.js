const express = require("express");
const router = express.Router();
const {
  GetAllProducts,
  GetProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, GetAllProducts);
router.get("/:id", authenticate, GetProduct);
router.post("/", authenticate, admin, addProduct);
router.put("/:id", authenticate, admin, updateProduct);
router.delete("/:id", authenticate, admin, deleteProduct);

module.exports = router;
