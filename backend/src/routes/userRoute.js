const express = require("express");
const router = express.Router();
const {
  GetAllUsers,
  GetUser,
  addUser,
  updateUser,
  updateSalary,
} = require("../controllers/userController");
const { authenticate, admin, adminormanager } = require("../middleware/auth");

router.get("/", authenticate, admin, GetAllUsers);
router.get("/:id", authenticate, adminormanager, GetUser);
router.post("/", authenticate, admin, addUser);
router.put("/:id", authenticate, admin, updateUser);
router.put("/:id/salary", authenticate, adminormanager, updateSalary);
module.exports = router;
