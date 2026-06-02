const pool = require("../config/db");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);
const createInvoice = async (req, res) => {
  try {
    const { items } = req.body;
    const customer_id = req.user.id;

    if (!items || items.length == 0) {
      return res.json({ error: "No items" });
    }
    let total = 0;
    for (const item of items) {
      const product = await pool.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );

      total = total + product.rows[0].price * item.quantity;
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "eur",
      metadata: {
        customer_id: customer_id.toString(),
        items: JSON.stringify(items),
      },
    });

    return res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    return res.json({ error: "Create invoice error" });
  }
};
const confirmPayment = async (req, res) => {
  try {
    const { payment_intent_id } = req.body;
    const customer_id = req.user.id;
    const paymentIntent =
      await stripe.paymentIntents.retrieve(payment_intent_id);
    if (paymentIntent.status != "succeeded") {
      return res.json({ error: "Payment not successful" });
    }
    const items = JSON.parse(paymentIntent.metadata.items);
    const total = paymentIntent.amount / 100;
    const invoice = await pool.query(
      "INSERT INTO invoices (customer_id, total, payment_method, is_paid, paid_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [customer_id, total, "stripe", true],
    );

    const invoice_id = invoice.rows[0].id;
    for (const item of items) {
      const product = await pool.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );
      await pool.query(
        "INSERT INTO invoice_items (invoice_id, product_id, quantity, item_price) VALUES ($1, $2, $3, $4)",
        [invoice_id, item.product_id, item.quantity, product.rows[0].price],
      );
    }
    return res.json({ invoice: invoice.rows[0] });
  } catch (error) {
    console.error(error);
    return res.json({ error: "Confirm payment error" });
  }
};
const GetAllInvoices = async (req, res) => {
  try {
    const invoices = await pool.query(
      "SELECT i.*, u.full_name FROM invoices i JOIN users u ON u.id = i.customer_id ORDER BY i.created_at ASC",
    );
    return res.json({ invoices: invoices.rows });
  } catch (error) {
    return res.json({ error: "Get invoices error" });
  }
};
module.exports = { createInvoice, confirmPayment, GetAllInvoices };
