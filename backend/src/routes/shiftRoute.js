const express = require("express");
const router = express.Router();
const { GetAllShifts, GetShift } = require("../controllers/shiftController");

const { authenticate, admin, adminormanager } = require("../middleware/auth");

router.get("/", authenticate, adminormanager, GetAllShifts);
router.get("/:id", authenticate, adminormanager, GetShift);

module.exports = router;
