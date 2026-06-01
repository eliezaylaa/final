const pool = require("../config/db");
const bcrypt = require("bcrypt");

const GetAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, full_name, email, role, salary, is_active, created_at FROM users",
    );
    return res.json({ users: users.rows });
  } catch (error) {
    return res.json({ error: "Get ALl users error" });
  }
};

module.exports = { GetAllUsers };
