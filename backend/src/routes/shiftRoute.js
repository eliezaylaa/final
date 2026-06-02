const express = require("express");
const router = express.Router();
const {
  GetAllShifts,
  GetShift,
  addShift,
} = require("../controllers/shiftController");

const { authenticate, admin, adminormanager } = require("../middleware/auth");

router.get("/", authenticate, adminormanager, GetAllShifts);
router.get("/:id", authenticate, adminormanager, GetShift);
router.post("/", authenticate, admin, addShift);

module.exports = router;
