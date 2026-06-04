const pool = require("../config/db");

const GetAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    return res.status(200).json({ products: products.rows });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GetProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (product.rows.length == 0)
      return res.status(404).json({ error: "Product not found" });
    return res.status(200).json({ product: product.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: "All fields required" });
    const product = await pool.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
      [name, price],
    );
    return res.status(201).json({ product: product.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const product = await pool.query(
      "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *",
      [name, price, id],
    );
    if (product.rows.length == 0)
      return res.status(404).json({ error: "Product not found" });
    return res.status(200).json({ product: product.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  GetAllProducts,
  GetProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
