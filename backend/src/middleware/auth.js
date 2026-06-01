const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.json({ error: "No Token" });
    }
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verification;
    next();
  } catch (error) {
    return res.json({ error: "Inavld token" });
  }
};

module.exports = { authenticate };
