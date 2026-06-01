const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");

const { authenticate } = require("../middleware/auth");

router.post("/register", register);

module.exports = router;
