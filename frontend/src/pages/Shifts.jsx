import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

function Shifts() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    api.get("/shifts").then((res) => setShifts(res.data.shifts || []));
  }, []);

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
          Shifts
        </Typography>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.full_name}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.date}</TableCell>
                  <TableCell>{s.start_time}</TableCell>
                  <TableCell>{s.end_time}</TableCell>
                  <TableCell>{s.check_in || "-"}</TableCell>
                  <TableCell>{s.check_out || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

export default Shifts;
