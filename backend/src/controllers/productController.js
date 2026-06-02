const pool = require("../config/db");

const GetAllProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    return res.json({ products: products.rows });
  } catch (error) {
    return res.json({ error: "Get products error" });
  }
};

module.exports = { GetAllProducts };
