import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, Typography, Button } from "@mui/material";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://final-m997.onrender.com/shop",
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <PaymentElement />
      {message && <Typography color="error">{message}</Typography>}
      <Button
        variant="contained"
        onClick={handlePay}
        sx={{ textTransform: "none" }}
      >
        Pay Now
      </Button>
    </Box>
  );
}

function Checkout() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "client_secret",
  );

  useEffect(() => {
    if (!clientSecret) {
      window.location.href = "/shop";
    }
  }, [clientSecret]);

  if (!clientSecret) return null;

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
          p: 4,
          borderRadius: 3,
          width: 500,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h5" fontWeight="600" mb={3}>
          Checkout
        </Typography>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </Box>
    </Box>
  );
}

export default Checkout;
