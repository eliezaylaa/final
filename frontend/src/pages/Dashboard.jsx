import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import { Box, Typography, Button } from "@mui/material";
import api from "../api/axios";

function Dashboard() {
  const [attendance, setAttendance] = useState([]);
  const [hours, setHours] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [weekStart, setWeekStart] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    api
      .get(`/kpi/attendance?week_start=${weekStart}`)
      .then((res) => setAttendance(res.data.attendance || []));
  }, [weekStart]);

  useEffect(() => {
    api.get("/kpi/hours").then((res) => setHours(res.data.hours || []));
    api.get("/kpi/payroll").then((res) => setPayroll(res.data.payroll || []));
  }, []);

  const prevWeek = () => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() - 7);
    setWeekStart(date.toISOString().split("T")[0]);
  };

  const nextWeek = () => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + 7);
    setWeekStart(date.toISOString().split("T")[0]);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Box
        sx={{
          width: 220,
          bgcolor: "white",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1,
        }}
      >
        <a href="/dashboard">
          <img src="/favicon.svg" style={{ width: 32, marginBottom: 16 }} />
        </a>
        {["Users", "Shifts", "Products", "Invoices"].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            style={{ textDecoration: "none" }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                "&:hover": { bgcolor: "#f5f5f5" },
                color: "#333",
                fontSize: 14,
              }}
            >
              {item}
            </Box>
          </a>
        ))}
        <Box sx={{ mt: "auto" }}>
          <Button
            fullWidth
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            sx={{ textTransform: "none", color: "#666" }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h5" fontWeight="600" mb={3}>
          Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 3,
                width: 400,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <Typography fontWeight="600" mb={1}>
                Weekly Attendance
              </Typography>
              <Box
                sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}
              >
                <Button
                  size="small"
                  onClick={prevWeek}
                  sx={{ textTransform: "none", minWidth: 0 }}
                >
                  prev
                </Button>
                <Typography variant="body2" color="#888">
                  {weekStart}
                </Typography>
                <Button
                  size="small"
                  onClick={nextWeek}
                  sx={{ textTransform: "none", minWidth: 0 }}
                >
                  next
                </Button>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={attendance}>
                  <XAxis dataKey="full_name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="hours_worked" fill="#1976d2" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 3,
                width: 400,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <Typography fontWeight="600" mb={2}>
                Staff Hours
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={hours}
                    dataKey="hours_worked"
                    nameKey="full_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#22c55e"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
          <Box
            sx={{
              bgcolor: "white",
              p: 3,
              borderRadius: 3,
              flex: 1,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <Typography fontWeight="600" mb={2}>
              Payroll Estimation
            </Typography>
            {payroll.map((p) => (
              <Box
                key={p.full_name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography>{p.full_name}</Typography>
                <Typography color="green">
                  {p.estimated_pay.toFixed(2)}€
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    api.post(`/users/${p.id}/pay`, { amount: p.estimated_pay })
                  }
                  sx={{ textTransform: "none" }}
                >
                  Pay
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
