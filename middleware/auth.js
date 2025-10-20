const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    // Allow guest access temporarily
    req.user = { userId: "guest-" + Date.now(), username: "Guest" };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Allow guest access if token invalid
      req.user = { userId: "guest-" + Date.now(), username: "Guest" };
      return next();
    }
    req.user = user; // { userId, username }
    next();
  });
}

function generateToken(user) {
  return jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

module.exports = { authenticateToken, generateToken, JWT_SECRET };
