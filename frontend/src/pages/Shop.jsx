import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

function Shop() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.products || []));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment_intent = params.get("payment_intent");
    if (payment_intent) {
      api
        .post("/invoices/confirm", { payment_intent_id: payment_intent })
        .then(() => {
          setSuccessMsg("Your invoice has been sent by email!");
          window.history.replaceState({}, "", "/shop");
        });
    }
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.product_id == product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product_id == product.id
            ? {
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleCheckout = async () => {
    const items = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    const res = await api.post("/invoices", { items });
    window.location.href = `/checkout?client_secret=${res.data.client_secret}`;
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          Shop
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
      {successMsg && <Typography mb={2}>{successMsg}</Typography>}
      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {products.map((p) => (
            <Card
              key={p.id}
              sx={{ width: 200, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <CardContent>
                <Typography fontWeight="600">{p.name}</Typography>
                <Typography color="#666">{p.price}€</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => addToCart(p)}
                  sx={{ textTransform: "none" }}
                >
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        <Box
          sx={{
            width: 280,
            bgcolor: "white",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            height: "fit-content",
          }}
        >
          <Typography variant="h6" fontWeight="600" mb={2}>
            Cart
          </Typography>
          {cart.length == 0 ? (
            <Typography color="#888">Empty</Typography>
          ) : (
            <>
              {cart.map((item) => (
                <Box
                  key={item.product_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>
                    {item.name} x{item.quantity}
                  </Typography>
                  <Typography>
                    {(item.price * item.quantity).toFixed(2)}€
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  mt: 2,
                  pt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontWeight="600">Total</Typography>
                <Typography fontWeight="600">{total.toFixed(2)}€</Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                sx={{ textTransform: "none", mt: 2 }}
              >
                Checkout
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Shop;