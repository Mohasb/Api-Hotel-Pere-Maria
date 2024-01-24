// Middleware para redireccionar de HTTP a HTTPS
const redirectToHTTPS = (req, res, next) => {
  if (req.secure) {
    // La solicitud ya es segura, continuar con el manejo normal
    next();
  } else {
    // Redirigir a la versión HTTPS
    res.redirect(`https://${req.hostname}:${httpsPort}${req.url}`);
  }
};

module.exports = redirectToHTTPS;
