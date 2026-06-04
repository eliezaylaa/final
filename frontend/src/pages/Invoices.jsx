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

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment_intent = params.get("payment_intent");
    if (payment_intent) {
      api
        .post("/invoices/confirm", { payment_intent_id: payment_intent })
        .then(() =>
          api
            .get("/invoices")
            .then((res) => setInvoices(res.data.invoices || [])),
        );
    } else {
      api.get("/invoices").then((res) => setInvoices(res.data.invoices || []));
    }
  }, []);

  const sorted = invoices.slice().sort((a, b) => {
    if (sortDir == "asc") return a.full_name.localeCompare(b.full_name);
    return b.full_name.localeCompare(a.full_name);
  });

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
          Invoices
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
                <TableCell
                  onClick={() => setSortDir(sortDir == "asc" ? "desc" : "asc")}
                  sx={{ cursor: "pointer" }}
                >
                  Customer {sortDir == "asc" ? "asc" : "des"}
                </TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.full_name}</TableCell>
                  <TableCell>{inv.total}€</TableCell>
                  <TableCell>{inv.payment_method}</TableCell>
                  <TableCell>{inv.is_paid ? "Paid" : "Not paid"}</TableCell>
                  <TableCell>
                    {inv.created_at ? inv.created_at.split("T")[0] : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

export default Invoices;
