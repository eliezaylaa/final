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
module.exports = { createInvoice };
