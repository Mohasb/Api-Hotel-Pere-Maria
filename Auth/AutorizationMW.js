const authorize = (requiredRole) => (req, res, next) => {
  if (req.user && req.user.role === requiredRole) {
    next(); // El usuario tiene el rol necesario, permite el acceso
  } else {
    res.status(403).json({ error: "Acceso prohibido" });
  }
};

module.exports = authorize;