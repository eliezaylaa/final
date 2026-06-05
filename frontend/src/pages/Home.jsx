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

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api
      .get("/users/mypayments")
      .then((res) => setPayments(res.data.payments || []));
  }, []);

  const handleCheckIn = async () => {
    await api.put("/shifts/checkin");
  };

  const handleCheckOut = async () => {
    await api.put("/shifts/checkout");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="600">
          Welcome, {user?.full_name}
        </Typography>
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          sx={{ textTransform: "none", color: "#666" }}
        >
          Logout
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleCheckIn}
          sx={{ textTransform: "none", px: 4 }}
        >
          Check In
        </Button>
        <Button
          variant="outlined"
          onClick={handleCheckOut}
          sx={{ textTransform: "none", px: 4 }}
        >
          Check Out
        </Button>
      </Box>
      <Typography variant="h6" fontWeight="600" mb={2}>
        My Payments
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
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.amount}€</TableCell>
                <TableCell>
                  {p.paid_at ? p.paid_at.split("T")[0] : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export default Home;
