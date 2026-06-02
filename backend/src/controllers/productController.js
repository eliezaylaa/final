const pool = require("../config/db");

const GetAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    return res.json({ products: products.rows });
  } catch (error) {
    return res.json({ error: "Get products error" });
  }
};
const GetProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (product.rows.length == 0)
      return res.json({ error: "Product not found" });
    return res.json({ product: product.rows[0] });
  } catch (error) {
    return res.json({ error: "Get product error" });
  }
};
const addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) return res.json({ error: "All fields required" });

    const product = await pool.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
      [name, price],
    );

    return res.json({ product: product.rows[0] });
  } catch (error) {
    return res.json({ error: "Add product error" });
  }
};
module.exports = { GetAllProducts, GetProduct, addProduct };
