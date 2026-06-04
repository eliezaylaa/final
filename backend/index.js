const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./src/config/db");
app.use(cors({ origin: "*" }));
app.use(express.json());

const authRoute = require("./src/routes/authRoute");
app.use("/auth", authRoute);
const userRoute = require("./src/routes/userRoute");
app.use("/users", userRoute);
const shiftRoute = require("./src/routes/shiftRoute");
app.use("/shifts", shiftRoute);
const productRoute = require("./src/routes/productRoute");
app.use("/products", productRoute);
const invoiceRoute = require("./src/routes/invoiceRoute");
app.use("/invoices", invoiceRoute);
const kpiRoute = require("./src/routes/kpiRoute");
app.use("/kpi", kpiRoute);

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});
