const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (id) => {
  return jwt.sign(id, JWT_SECRET);
};

const verifyToken = (id) => {
  return jwt.verify(id, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
