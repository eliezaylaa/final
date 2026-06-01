const express = require("express");
const router = express.Router();
const { GetAllUsers, GetUser } = require("../controllers/userController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, admin, GetAllUsers);
router.get("/:id", authenticate, GetUser);
module.exports = router;
