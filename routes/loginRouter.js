const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = require("../models/userSchema");

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {

    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    
    // Verificar si el usuario existe en la base de datos
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Verificar la contraseña utilizando bcrypt
    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      user.password.trim()
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const secretKey = process.env.TOKEN_SECRET;
    const payload = {
      email: req.body.email,
      pass: password,
      role: user.role,
    };

    const options = {
      expiresIn: "1h", // El token expirará en 1 hora
    };

    const token = jwt.sign(payload, secretKey, options);
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error durante el inicio de sesión" });
  }
};

module.exports = loginUser;
