const express = require("express");
const router = express.Router();
const userSchema = require("../models/userSchema");


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/getAll:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal server error occurred
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         user_name:
 *           type: string
 *           example: JohnDoe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           example: secretpassword
 *         role:
 *           type: string
 *           example: user
 *         reservations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               room_number:
 *                 type: number
 *                 example: 101
 *               check_in_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-20T00:00:00.000Z"
 *               check_out_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-25T00:00:00.000Z"
 *     ObjectId:
 *       type: object
 *       properties:
 *         $oid:
 *           type: string
 *           example: "6582e8ef18797a4afefb1c42"
 */
router.get("/getAll", async (req, res) => {
  try {
    const data = await userSchema.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/getOne/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     description: Retrieve a user by their email address
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email address of the user
 *         schema:
 *           type: string
 *           example: johndoe@example.com
 *     responses:
 *       '200':
 *         description: A single user object
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.get("/getOne/:email", async (req, res) => {
  const { email } = req.params;

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

/**
 * @swagger
 * /api/new:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new user with provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               reservations:
 *                 type: array
 *                 items:
 *                   type: object
 *             example:
 *               user_name: John Doe
 *               email: johndoe@example.com
 *               password: secretPassword
 *               role: user
 *               reservations: []
 *     responses:
 *       '200':
 *         description: User created successfully
 *       '400':
 *         description: Bad request, invalid data provided
 *       '500':
 *         description: Server error
 */
router.post("/new", async (req, res) => {
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

/**
 * @swagger
 * /api/update:
 *   patch:
 *     summary: Update a user by email
 *     tags: [Users]
 *     description: Update user details based on the provided email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the user to be updated
 *               user_name:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               reservations:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reservation'
 *     responses:
 *       '200':
 *         description: Document successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documento actualizado exitosamente
 *       '404':
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documento no encontrado
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message describing the issue
 *
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         room_number:
 *           type: number
 *           description: Room number
 *         check_in_date:
 *           type: string
 *           format: date-time
 *           description: Check-in date and time
 *         check_out_date:
 *           type: string
 *           format: date-time
 *           description: Check-out date and time
 */
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
