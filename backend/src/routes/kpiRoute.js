const express = require("express");
const router = express.Router();
const {
  getWeeklyAttendance,
  getStaffHours,
} = require("../controllers/kpiController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/attendance", authenticate, admin, getWeeklyAttendance);
router.get("/hours", authenticate, admin, getStaffHours);

module.exports = router;
