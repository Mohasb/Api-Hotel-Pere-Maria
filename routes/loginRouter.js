const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = require("../models/userSchema");

const loginUser = async (req, res, next) => {
  const { user_name, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await userSchema.findOne({ user_name });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    console.log(user.password);
    console.log(password);
    console.log('Longitud de la contraseña proporcionada:', password.length);
console.log('Longitud del hash almacenado:', user.password.length);

    // Verificar la contraseña utilizando bcrypt
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password.trim());
    console.log('Hash almacenado:', user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const secretKey = process.env.TOKEN_SECRET;
    const payload = {
      name: req.body.user_name,
      pass: password,
      role: req.body.role,
    };

    const options = {
      expiresIn: "1h", // El token expirará en 1 hora
    };

    const token = jwt.sign(payload, secretKey, options);
    req.token = token;

    // Se guarda el token en la cabecera de la respuesta (token)
    next();
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    res.status(500).json({ error: "Error durante el inicio de sesión" });
  }
};

module.exports = loginUser;
