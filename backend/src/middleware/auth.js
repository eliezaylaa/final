const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No Token" });
    }
    const verification = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verification;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const admin = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(401).json({ error: "Access denied" });
  }
  next();
};

const adminormanager = (req, res, next) => {
  if (req.user.role != "admin" && req.user.role != "manager") {
    return res.status(401).json({ error: "Access denied" });
  }
  next();
};
const employeeormanager = (req, res, next) => {
  if (req.user.role != "employee" && req.user.role != "manager") {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};

module.exports = { authenticate, admin, adminormanager, employeeormanager };
