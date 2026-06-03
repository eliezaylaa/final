const pool = require("../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");

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
    if (user.rows.length == 0) {
      return res.json({ error: "User not found" });
    }
    return res.json({ user: user.rows[0] });
  } catch (error) {
    return res.json({ error: "Get User error" });
  }
};
const addUser = async (req, res) => {
  try {
    const { full_name, email, password, role, salary } = req.body;
    if (!full_name || !email || !password) {
      return res.json({ error: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ error: "Incorrect email syntax" });
    }
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userCheck.rows.length > 0) {
      return res.json({ error: "User already exists" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.json({ error: "Incorrect password syntax" });
    }
    const hashed = await bcrypt.hash(password, 12);

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password, role, salary) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role, salary",
      [full_name, email, hashed, role, salary],
    );

    return res.json({ user: newUser.rows[0] });
  } catch (error) {
    return res.json({ error: "Add user error" });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role, salary } = req.body;

    const user = await pool.query(
      "UPDATE users SET full_name = $1, email = $2, role = $3, salary = $4 WHERE id = $5 RETURNING id, full_name, email, role, salary",
      [full_name, email, role, salary, id],
    );

    if (user.rows.length == 0) {
      return res.json({ error: "User not found" });
    }

    await pool.query("DELETE FROM refresh_token WHERE user_id = $1", [id]);

    return res.json({ user: user.rows[0] });
  } catch (error) {
    return res.json({ error: "Update user errpr" });
  }
};
const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { salary } = req.body;

    const user = await pool.query(
      "UPDATE users SET salary = $1 WHERE id = $2 RETURNING id, full_name, salary",
      [salary, id],
    );

    if (user.rows.length == 0) {
      return res.json({ error: "User not found" });
    }

    return res.json({ user: user.rows[0] });
  } catch (error) {
    return res.json({ error: "Update salary error" });
  }
};
const fireUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      "UPDATE users SET is_active = false WHERE id = $1 RETURNING id, full_name, is_active",
      [id],
    );

    if (user.rows.length == 0) {
      return res.json({ error: "User not found" });
    }

    return res.json({ message: "User fired", user: user.rows[0] });
  } catch (error) {
    return res.json({ error: "Fire user error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    return res.json({ message: "User deleted" });
  } catch (error) {
    return res.json({ error: "Delete user error" });
  }
};
const payManagerorEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    await pool.query("UPDATE users SET last_paid_at = NOW() WHERE id = $1", [
      id,
    ]);

    return res.json({ message: "Paid", amount });
  } catch (error) {
    return res.json({ error: "Pay error" });
  }
};

module.exports = {
  GetAllUsers,
  GetUser,
  addUser,
  updateUser,
  updateSalary,
  fireUser,
  deleteUser,
  payManagerorEmployee,
};
