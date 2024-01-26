const jwt = require("jsonwebtoken");

const loginUser = (req, res, next) => {
  //hash del password
  ///Obtener objeto post user y poer pass hasheado
  // hash contraseña
  //const salt = await bcrypt.genSalt(10);
  //const password = await bcrypt.hash(req.body.password, salt);


  // Comprobar si existe el user!!!!!!!!!!!!
  // si existe----->
  const user = {
    user_name: req.body.user_name,
    pass: req.body.pass, //aqui!!!!!!!
    role: req.body.role,
  };

  const secretKey = process.env.TOKEN_SECRET;
  const payload = {
    name: user.user_name,
    pass: user.pass,
    role: user.role,
  };

  const options = {
    expiresIn: "1h", // El token expirará en 1 hora
  };

  const token = jwt.sign(payload, secretKey, options);
  req.token = token;

  // Añadir a cabecera de respuesta
  /*  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });  */
  //se guarda en token en el cliente de la cabecera de la respuesta(token)
  next();
};


module.exports = loginUser;

