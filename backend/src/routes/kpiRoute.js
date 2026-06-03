const express = require("express");
const router = express.Router();
const { getWeeklyAttendance } = require("../controllers/kpiController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/attendance", authenticate, admin, getWeeklyAttendance);

module.exports = router;
