import { useState, useEffect } from "react";
import api from "../api/axios";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role == "admin") {
        window.location.href = "/dashboard";
      } else if (user?.role == "manager" || user?.role == "employee") {
        window.location.href = "/home";
      } else {
        window.location.href = "/shop";
      }
    }
  }, []);
  gj6yju5j6y;

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (!res.data.access) {
        setError("Invalid credentials");
        return;
      }
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role == "admin") {
        window.location.href = "/dashboard";
      } else if (role == "manager" || role == "employee") {
        window.location.href = "/home";
      } else {
        window.location.href = "/shop";
      }
    } catch (err) {
      setError(err.response?.data?.error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f5f5f5" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Typography
            variant="h2"
            align="center"
            fontWeight="bold"
            color="#1a1a1a"
          >
            YoYo's Club
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            sx={{
              py: 1.5,
              textTransform: "none",
              fontSize: 16,
              borderRadius: 2,
            }}
          >
            Sign in
          </Button>
          <Typography color="#888" variant="body2">
            No account?{" "}
            <a href="/register" style={{ color: "#1976d2" }}>
              Register
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
