const pool = require("../config/db");

const getWeekShifts = async (week_start) => {
  const start = week_start || new Date().toISOString().split("T")[0];
  const shifts = await pool.query(
    "SELECT u.id, u.full_name, u.salary, s.date, s.start_time, s.end_time, s.check_in, s.check_out FROM shifts s JOIN users u ON u.id = s.user_id WHERE s.date >= $1 AND s.date < $1::date + INTERVAL '7 days'",
    [start],
  );
  return shifts.rows;
};

const getMonthShifts = async () => {
  const shifts = await pool.query(
    "SELECT u.id, u.full_name, u.salary, s.date, s.start_time, s.end_time, s.check_in, s.check_out FROM shifts s JOIN users u ON u.id = s.user_id WHERE date_trunc('month', s.date) = date_trunc('month', CURRENT_DATE)",
  );
  return shifts.rows;
};

const getWeeklyAttendance = async (req, res) => {
  try {
    const rows = await getWeekShifts(req.query.week_start);
    const result = {};
    rows.forEach((row) => {
      if (!result[row.id])
        result[row.id] = { full_name: row.full_name, hours_worked: 0 };
      if (row.check_in && row.check_out) {
        result[row.id].hours_worked +=
          (new Date(row.check_out) - new Date(row.check_in)) / 3600000;
      }
    });
    return res.json({ attendance: Object.values(result) });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const getStaffHours = async (req, res) => {
  try {
    const rows = await getMonthShifts();
    const result = {};
    rows.forEach((row) => {
      if (!result[row.id])
        result[row.id] = { full_name: row.full_name, hours_worked: 0 };
      if (row.check_in && row.check_out) {
        result[row.id].hours_worked +=
          (new Date(row.check_out) - new Date(row.check_in)) / 3600000;
      }
    });
    return res.json({ hours: Object.values(result) });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const getPayrollEstimation = async (req, res) => {
  try {
    const rows = await getMonthShifts();
    const result = {};
    rows.forEach((row) => {
      if (!result[row.id])
        result[row.id] = {
          full_name: row.full_name,
          salary: row.salary,
          estimated_pay: 0,
        };
      if (row.check_in && row.check_out) {
        const hours =
          (new Date(row.check_out) - new Date(row.check_in)) / 3600000;
        result[row.id].estimated_pay += row.salary * hours;
      }
    });
    return res.json({ payroll: Object.values(result) });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = { getWeeklyAttendance, getStaffHours, getPayrollEstimation };
