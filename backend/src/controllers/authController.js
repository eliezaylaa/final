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
    await pool.query(
      "INSERT INTO users(email,password,full_name) VALUES ($1, $2, $3)",
      [email, hashed, full_name],
    );

    req.body = { email, password };
    return login(req, res);
  } catch (error) {
    console.error(error);
    res.json({ error: "Registation error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ error: "All fields required" });
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length == 0) {
      return res.json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) {
      return res.json({ error: "Invalid credentiald" });
    }
    const access = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );
    const refresh = jwt.sign(
      { id: user.rows[0].id },
      process.env.REFRESH_SECRET,
      { expiresIn: "14d" },
    );
    await pool.query(
      "INSERT INTO refresh_token(user_id,token) VALUES ($1,$2)",
      [user.rows[0].id, refresh],
    );

    return res.json({
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        full_name: user.rows[0].full_name,
      },
      access,
      refresh,
    });
  } catch (error) {
    res.json({ error: "Login error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refresh } = req.body;
    if (!refresh) {
      return res.json({ error: "No refresh token" });
    }
    const decrypt = jwt.verify(refresh, process.env.REFRESH_SECRET);

    const tokenCheck = await pool.query(
      "SELECT * FROM refresh_token WHERE user_id = $1 AND token = $2",
      [decrypt.id, refresh],
    );
    if (tokenCheck.rows.length == 0) {
      return res.json({ error: "Invalid refresh token" });
    }

    const user = await pool.query("SELECT id,role from users WHERE id = $1", [
      decrypt.id,
    ]);

    const access = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );
    return res.json({ access });
  } catch (error) {
    return res.json({ error: "Refresh token error" });
  }
};

const logout = async (req, res) => {
  try {
    const { refresh } = req.body;
    if (!refresh) {
      return res.json({ error: "Refresh token requirea" });
    }
    await pool.query("DELETE FROM refresh_token WHERE token = $1", [refresh]);
    return res.json({ message: "Logged out succesfully" });
  } catch (error) {
    return res.json({ error: "Logout error" });
  }
};

module.exports = { register, login, refreshToken, logout };
