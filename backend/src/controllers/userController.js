const pool = require("../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");

const GetAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, full_name, email, role, salary, is_active, created_at FROM users",
    );
    return res.status(200).json({ users: users.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "SELECT id, full_name, email, role, salary, is_active, created_at FROM users where id = $1",
      [id],
    );
    if (user.rows.length == 0)
      return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user: user.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { full_name, email, password, role, salary } = req.body;
    if (!full_name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });
    if (!validator.isEmail(email))
      return res.status(400).json({ error: "Incorrect email syntax" });
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0)
      return res.status(400).json({ error: "User already exists" });
    if (!validator.isStrongPassword(password))
      return res.status(400).json({ error: "Incorrect password syntax" });
    const hashed = await bcrypt.hash(password, 12);
    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password, role, salary) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role, salary",
      [full_name, email, hashed, role, salary],
    );
    return res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
    if (user.rows.length == 0)
      return res.status(404).json({ error: "User not found" });
    await pool.query("DELETE FROM refresh_token WHERE user_id = $1", [id]);
    return res.status(200).json({ user: user.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
    if (user.rows.length == 0)
      return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user: user.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const fireUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "UPDATE users SET is_active = false WHERE id = $1 RETURNING id, full_name, is_active",
      [id],
    );
    if (user.rows.length == 0)
      return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ message: "User fired", user: user.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const payManagerorEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    await pool.query("UPDATE users SET last_paid_at = NOW() WHERE id = $1", [
      id,
    ]);
    await pool.query("INSERT INTO payments (user_id, amount) VALUES ($1, $2)", [
      id,
      amount,
    ]);
    return res.status(200).json({ message: "Paid", amount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getMyPayments = async (req, res) => {
  try {
    const payments = await pool.query(
      "SELECT * FROM payments WHERE user_id = $1 ORDER BY paid_at DESC",
      [req.user.id],
    );
    return res.status(200).json({ payments: payments.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
  getMyPayments,
};
