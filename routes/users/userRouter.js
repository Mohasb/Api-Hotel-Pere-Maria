const express = require("express");
const router = express.Router();
const userSchema = require("../../models/userSchema");
const loginUser = require("../login/loginRouter");
const verifyToken = require("../../Auth/AuthJwtMW");
const authorize = require("../../Auth/AutorizationMW");
const schemaRegister = require("../../validations/registerSchema");


router.use("/login", loginUser);

///////////////////////////////////////////////////////////////////////////////////////////////
// Obtener todos los usuarios
/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints relacionados con la gestión de usuarios
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene la lista de todos los usuarios registrados.
 *     tags: [Usuarios]
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida correctamente.
 *         content:
 *           application/json:
 *             example:
 *               - _id: "60f85c8477742b001db54c4d"
 *                 user_name: "Usuario1"
 *                 email: "usuario1@gmail.com"
 *                 role: "user"
 *                 reservations: []
 *               - _id: "60f85c8477742b001db54c4e"
 *                 user_name: "Usuario2"
 *                 email: "usuario2@gmail.com"
 *                 role: "admin"
 *                 reservations: []
 *       '500':
 *         description: Error al obtener la lista de usuarios.
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener la lista de usuarios."
 */
router.get(
  "/",
  /*verifyToken, authorize("superAdmin"),*/ async (req, res) => {
    try {
      const data = await userSchema.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Obtener un usuario
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    const data = await userSchema.find({ email });

    if (!data.length) {
      return res
        .status(404)
        .json({ message: `Usuario '${email}' no encontrado` });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir usuario
router.post("/", async (req, res) => {
  // validate user
  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(400).json({ error: "Email ya registrado" });
  }

  const data = new userSchema({
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    reservations: req.body.reservations,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//modificar un usuario
router.patch("/update", async (req, res) => {
  try {
    const email = req.body.email;

    const resultado = await userSchema.updateOne(
      { email },
      {
        $set: {
          user_name: req.body.user_name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          reservations: req.body.reservations,
        },
      }
    );

    if (resultado.modifiedCount === 0) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.status(200).json({ message: "Documento actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error, message: error.message });
  }
});

module.exports = router;
