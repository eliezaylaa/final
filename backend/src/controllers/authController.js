const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.json({ error: "ALl fields are required" });
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
      "INSERT INTO users(email,password,full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, role",
      [email, hashed, full_name],
    );
    const access = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    const refresh = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    await pool.query(
      "INSERT INTO refresh_token (user_id,token) VALUES ($1, $2)",
      [newUser.rows[0].id, refresh],
    );
    return res.json({ user: newUser.rows[0], access, refresh });
  } catch (error) {
    console.error(error);
    res.json({ error: "Registation error" });
  }
};
module.exports = { register };
