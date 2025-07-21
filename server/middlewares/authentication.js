const { verifyToken } = require("../helpers/jwt");

module.exports = async function authentication(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const realToken = token.split(" ")[1];
    const verify = verifyToken(realToken);
    const user = await user.findbyPk(verify.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
      console.error("Authentication error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
