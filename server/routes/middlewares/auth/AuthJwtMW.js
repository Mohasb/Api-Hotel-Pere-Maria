const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next(); // continuamos
  } catch (error) {
    res.status(401).json({ error: "token no es válido" });
  }
};

module.exports = verifyToken;
