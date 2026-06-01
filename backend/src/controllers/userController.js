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

const GetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "SELECT id, full_name, email, role, salary, is_active, created_at FROM users where id = $1",
      [id],
    );
    if (user.rows.lengh == 0) {
      return res.json({ error: "User not found" });
    }
    return res.json({ user: user.rows[0] });
  } catch (error) {
    return res.json({ error: "Get User error" });
  }
};

module.exports = { GetAllUsers, GetUser };
