const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/index");

module.exports = async function authentication(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const realToken = token.split(" ")[1];
    const verify = verifyToken(realToken);
    const user = await User.findByPk(verify.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
