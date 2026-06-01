const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ error: "No Token" });
    }
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verification;
    next();
  } catch (error) {
    return res.json({ error: "Inavld token" });
  }
};

const admin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.json({ error: "Access denied" });
  }
  next();
};

const adminormanager = (req, res, next) => {
  if (req.user.role != "admin" && req.user.role != "manager") {
    return res.json({ error: "Access denied" });
  }
  next();
};

module.exports = { authenticate, admin, adminormanager };
