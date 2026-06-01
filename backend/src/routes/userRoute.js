const express = require("express");
const router = express.Router();
const { GetAllUsers } = require("../controllers/userController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, admin, GetAllUsers);

module.exports = router;
