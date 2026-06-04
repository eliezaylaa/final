import { useState } from "react";
import api from "../api/axios";
import { Box, Typography, Button } from "@mui/material";
function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");

  const handleCheckIn = async () => {
    try {
      await api.put("/shifts/checkin");
      setMessage("Checked in successfully");
    } catch (err) {
      setMessage(err.response.data.error || "Error");
    }
  };
  const handleCheckOut = async () => {
    try {
      await api.put("/shifts/checkout");
      setMessage("Checked out successfully");
    } catch (err) {
      setMessage(err.response.data.error || "Error");
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 6,
          borderRadius: 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="600">
          Welcome, {user?.full_name}
        </Typography>
        {message && <Typography color="green">{message}</Typography>}
        <Box sx={{ display: "flex", gap: 2 }}>
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
    </Box>
  );
}

export default Home;
