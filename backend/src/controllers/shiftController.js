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

module.exports = { GetAllShifts, GetShift };
