const pool = require("../config/db");

const GetAllShifts = async (req, res) => {
  try {
    const shifts = await pool.query(
      "SELECT s.id, u.full_name, u.role, s.date, s.start_time, s.end_time, s.check_in, s.check_out  FROM shifts s JOIN users u ON u.id = s.user_id ORDER BY s.date ASC",
    );
    return res.status(200).json({ shifts: shifts.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GetShift = async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await pool.query(
      "SELECT s.id, u.full_name, u.role, s.date, s.start_time, s.end_time FROM shifts s JOIN users u ON u.id = s.user_id WHERE s.id = $1",
      [id],
    );
    if (shift.rows.length == 0)
      return res.status(404).json({ error: "Shift not found" });
    return res.status(200).json({ shift: shift.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addShift = async (req, res) => {
  try {
    const { user_id, date, start_time, end_time } = req.body;
    if (!user_id || !date || !start_time || !end_time) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const shift = await pool.query(
      "INSERT INTO shifts (user_id, date, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, date, start_time, end_time],
    );
    return res.status(201).json({ shift: shift.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, start_time, end_time } = req.body;
    const shift = await pool.query(
      "UPDATE shifts SET date = $1, start_time = $2, end_time = $3 WHERE id = $4 RETURNING *",
      [date, start_time, end_time, id],
    );
    if (shift.rows.length == 0)
      return res.status(404).json({ error: "Shift not found" });
    return res.status(200).json({ shift: shift.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM shifts WHERE id = $1", [id]);
    return res.status(200).json({ message: "Shift deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const user_id = req.user.id;
    await pool.query(
      "UPDATE shifts SET check_in = NOW() WHERE user_id = $1 AND date = CURRENT_DATE",
      [user_id],
    );
    return res.status(200).json({ message: "Checked in" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const user_id = req.user.id;
    await pool.query(
      "UPDATE shifts SET check_out = NOW() WHERE user_id = $1 AND date = CURRENT_DATE",
      [user_id],
    );
    return res.status(200).json({ message: "Checked out" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllShifts,
  GetShift,
  addShift,
  updateShift,
  deleteShift,
  checkIn,
  checkOut,
};
