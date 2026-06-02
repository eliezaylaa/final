const pool = require("../config/db");

const GetAllShifts = async (req, res) => {
  try {
    const shifts = await pool.query(
      "SELECT s.id, u.full_name, u.role, s.date, s.start_time, s.end_time FROM shifts s JOIN users u ON u.id = s.user_id ORDER BY s.date ASC",
    );
    return res.json({ shifrs: shifts.rows });
  } catch (error) {
    return res.json({ error: "Get all shifts error" });
  }
};
const GetShift = async (req, res) => {
  try {
    const { id } = req.params;

    const shift = await pool.query(
      "SELECT s.id, u.full_name, u.role, s.date, s.start_time, s.end_time FROM shifts s JOIN users u ON u.id = s.user_id WHERE s.id = $1",
      [id],
    );

    if (shift.rows.length == 0) {
      return res.json({ error: "Shift not found" });
    }

    return res.json({ shift: shift.rows[0] });
  } catch (error) {
    return res.json({ error: "Get shift error" });
  }
};
const addShift = async (req, res) => {
  try {
    const { user_id, date, start_time, end_time } = req.body;

    if (!user_id || !date || !start_time || !end_time) {
      return res.json({ error: "All fields are required" });
    }
    const shift = await pool.query(
      "INSERT INTO shifts (user_id, date, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, date, start_time, end_time],
    );

    return res.json({ shift: shift.rows[0] });
  } catch (error) {
    return res.json({ error: "Create shift error" });
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
    if (shift.rows.length == 0) {
      return res.json({ error: "Shift not found" });
    }

    return res.json({ shift: shift.rows[0] });
  } catch (error) {
    return res.json({ error: "Update shift error" });
  }
};
module.exports = { GetAllShifts, GetShift, addShift, updateShift };
