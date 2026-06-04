const express = require("express");
const router = express.Router();
const {
  GetAllShifts,
  GetShift,
  addShift,
  updateShift,
  deleteShift,
  checkIn,
  checkOut,
} = require("../controllers/shiftController");

const { authenticate, admin, adminormanager } = require("../middleware/auth");

router.get("/", authenticate, adminormanager, GetAllShifts);
router.get("/:id", authenticate, adminormanager, GetShift);
router.post("/", authenticate, admin, addShift);
router.put("/checkin", authenticate, checkIn);
router.put("/checkout", authenticate, checkOut);
router.put("/:id", authenticate, adminormanager, updateShift);
router.delete("/:id", authenticate, admin, deleteShift);

module.exports = router;
