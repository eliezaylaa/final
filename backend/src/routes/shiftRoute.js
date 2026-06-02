const express = require("express");
const router = express.Router();
const {
  GetAllShifts,
  GetShift,
  addShift,
  updateShift,
} = require("../controllers/shiftController");

const { authenticate, admin, adminormanager } = require("../middleware/auth");

router.get("/", authenticate, adminormanager, GetAllShifts);
router.get("/:id", authenticate, adminormanager, GetShift);
router.post("/", authenticate, admin, addShift);
router.put("/:id", authenticate, adminormanager, updateShift);

module.exports = router;
