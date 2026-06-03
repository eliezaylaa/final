const express = require("express");
const router = express.Router();
const {
  getWeeklyAttendance,
  getStaffHours,
  getPayrollEstimation,
} = require("../controllers/kpiController");
const { authenticate, admin } = require("../middleware/auth");

router.get("/attendance", authenticate, admin, getWeeklyAttendance);
router.get("/hours", authenticate, admin, getStaffHours);
router.get("/payroll", authenticate, admin, getPayrollEstimation);

module.exports = router;
