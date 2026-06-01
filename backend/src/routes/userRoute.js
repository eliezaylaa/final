const express = require("express");
const router = express.Router();
const {
  GetAllUsers,
  GetUser,
  addUser,
} = require("../controllers/userController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, admin, GetAllUsers);
router.get("/:id", authenticate, GetUser);
router.post("/", authenticate, admin, addUser);
module.exports = router;
