const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) return res.status(403).json({ error: "Access denied. No token provided." });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, name:user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = { verifyJWT, generateToken };
