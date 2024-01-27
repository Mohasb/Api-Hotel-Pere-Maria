const express = require("express");
const router = express.Router();
const userSchema = require("../../models/userSchema");
const loginUser = require("../login/loginRouter");
const verifyToken = require("../middlewares/auth/AuthJwtMW");
const authorize = require("../middlewares/auth/AutorizationMW");
const schemaRegister = require("../../validations/registerSchema");
const { rojo, verde, print } = require("../../helpers/colors");
const bcrypt = require("bcrypt");
const checkUserExistence = require("../middlewares/userExists");

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
/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Obtener un usuario por email
 *     description: Obtiene la información de un usuario específico mediante su dirección de correo electrónico.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Dirección de correo electrónico del usuario.
 *         example: mh@gmail.com
 *     responses:
 *       '200':
 *         description: Información del usuario obtenida correctamente.
 *         content:
 *           application/json:
 *             example:
 *               - _id: "60f85c8477742b001db54c4d"
 *                 user_name: "Usuario1"
 *                 email: "mh@gmail.com"
 *                 role: "user"
 *                 reservations: []
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario 'mh@gmail.com' no encontrado"
 *       '500':
 *         description: Error al obtener la información del usuario.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener la información del usuario."
 */
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: `Usuario '${email}' no encontrado` });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir usuario
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Añadir usuario
 *     description: Añade un nuevo usuario al sistema.
 *     tags: [Usuarios]
 *     parameters: []
 *     requestBody:
 *       description: Datos del nuevo usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Nombre de usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Dirección de correo electrónico única del usuario.
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *               role:
 *                 type: string
 *                 description: Rol del usuario (ej. "user", "admin", "superAdmin").
 *                 default: user
 *               reservations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     room_number:
 *                       type: number
 *                       description: Número de la habitación de la reserva.
 *                     check_in_date:
 *                       type: string
 *                       format: date
 *                       description: Fecha de entrada de la reserva.
 *                     check_out_date:
 *                       type: string
 *                       format: date
 *                       description: Fecha de salida de la reserva.
 *                   description: Lista de reservas del usuario.
 *                 default: []
 *     responses:
 *       '200':
 *         description: Usuario añadido exitosamente.
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             user_name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *             reservations:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room_number:
 *                     type: number
 *                   check_in_date:
 *                     type: string
 *                     format: date
 *                   check_out_date:
 *                     type: string
 *                     format: date
 *       '400':
 *         description: Error en la validación de datos o email ya registrado.
 *         schema:
 *           type: object
 *           properties:
 *             validationError:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error de validación.
 *             emailRegisteredError:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error de email ya registrado.
 *       '500':
 *         description: Error al añadir el usuario.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensaje de error general.
 */
//Añadir nuevo usuario
router.post("/", checkUserExistence, async (req, res) => {
  // validate user
  const { error } = schemaRegister.validate(req.body);

  console.log(error);
  if (error) {
    console.log({ error: error.details[0].message });
    return res.status(400).json({ error: error.details[0].message });
  }

  //const isEmailExist = await userSchema.findOne({ email: req.body.email });
  //if (isEmailExist) {
  //  return res.status(400).json({ error: "Email ya registrado" });
  //}

  // Hash de la contraseña
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  //Por defecto al registrarse el rol es user y el array de reservas está vacío

  const data = new userSchema({
    user_name: req.body.user_name,
    email: req.body.email,
    password: hashedPassword,
    role: "user",
    reservations: [],
  });

  try {
    const dataToSave = await data.save();
    print(verde + "Nuevo usuario añadido:");
    console.log(dataToSave);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message + "en MongoDb" });
  }
});

//modificar un usuario
/**
 * @swagger
 * /api/users/update/{email}:
 *   patch:
 *     summary: Actualizar usuario
 *     description: Actualiza la información de un usuario existente en la base de datos.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Correo electrónico del usuario a actualizar.
 *         schema:
 *           type: string
 *           format: email
 *     requestBody:
 *       description: Campos a actualizar del usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Nuevo nombre de usuario.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico del usuario.
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del usuario.
 *               reservations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     room_number:
 *                       type: number
 *                       description: Número de la habitación de la reserva.
 *                     check_in_date:
 *                       type: string
 *                       format: date
 *                       description: Fecha de entrada de la reserva.
 *                     check_out_date:
 *                       type: string
 *                       format: date
 *                       description: Fecha de salida de la reserva.
 *                 description: Lista de nuevas reservas del usuario.
 *     responses:
 *       '200':
 *         description: Documento actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: Documento actualizado exitosamente
 *       '400':
 *         description: Error en la solicitud o en la actualización del documento.
 *         content:
 *           application/json:
 *             example:
 *               error: Detalles del error
 *               message: Mensaje de error
 *       '404':
 *         description: Usuario no encontrado en la base de datos.
 *         content:
 *           application/json:
 *             example:
 *               message: Documento no encontrado
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Detalles del error
 *               message: Mensaje de error
 */
//modificar usuario
router.patch("/update/:email", checkUserExistence, async (req, res) => {
  try {
    const email = req.params.email;

    // Solo actualizamos los campos que se envían en el cuerpo de la solicitud
    const updateFields = {
      user_name: req.body.user_name,
      email: req.body.email,
      password: req.body.password,
      reservations: req.body.reservations,
    };

    // Si se proporciona un nuevo password, lo hasheamos
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateFields.password = hashedPassword;
    }

     // Eliminamos campos undefined del objeto para que no se sobrescriban con valores undefined
     Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

     console.log(updateFields);
     const resultado = await userSchema.updateOne(
      { email },
      { $set: updateFields }
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
