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
module.exports = { GetAllProducts, GetProduct };
