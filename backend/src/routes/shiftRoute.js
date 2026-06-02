const express = require("express");
const router = express.Router();
const { GetAllShifts } = require("../controllers/shiftController");

const { authenticate, admin } = require("../middleware/auth");

router.get("/", authenticate, admin, GetAllShifts);

module.exports = router;
