const express = require("express");
const router = express.Router();
const reservationSchema = require("../../models/reservationSchema");
const userSchema = require("../../models/userSchema");

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints relacionados con la gestión de Reservas
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtiene todas las reservas.
 *     description: Retorna todas las reservas almacenadas en la base de datos.
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Éxito, devuelve la lista de reservas.
 *         content:
 *           application/json:
 *             example:
 *               - _id: 12345
 *                 user: { email: 'usuario@example.com', username: 'EjemploUsuario' }
 *                 room_number: 101
 *                 check_in_date: '2024-02-01T12:00:00Z'
 *                 check_out_date: '2024-02-05T12:00:00Z'
 *                 price_per_night: 150.50
 *                 extras: [{ name: 'wifi', price: 10.00 }, { name: 'gym', price: 15.00 }]
 *                 cancelation_date: '2024-01-15T12:00:00Z'
 *       500:
 *         description: Error del servidor.
 */

router.get("/", async (req, res) => {
  try {
    const reservations = await reservationSchema.find();

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reservations/{email}:
 *   get:
 *     summary: Obtiene todas las reservas de un usuario filtradas por email.
 *     description: Retorna todas las reservas de un usuario almacenadas en la base de datos, filtradas por su email.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario para filtrar las reservas.
 *     responses:
 *       200:
 *         description: Éxito, devuelve la lista de reservas del usuario.
 *         content:
 *           application/json:
 *             example:
 *               - _id: 12345
 *                 user: { email: 'user@example.com', username: 'john_doe' }
 *                 room_number: 101
 *                 check_in_date: '2024-01-05T00:00:00.000Z'
 *                 check_out_date: '2024-01-10T00:00:00.000Z'
 *                 extras: [{ name: 'WiFi', price: 10 }, { name: 'Breakfast', price: 15 }]
 *                 price_per_night: 120.5
 *                 cancelation_date: '2024-01-05T00:00:00.000Z'
 *       500:
 *         description: Error del servidor.
 */
router.get("/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;

    const reservations = await reservationSchema.find({
      "user.email": userEmail,
    });

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reservations/{email}/{index}:
 *   delete:
 *     summary: Elimina una reserva por su índice.
 *     description: Elimina una reserva específica de un usuario por su índice en el array de reservas.
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario.
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *         description: Índice de la reserva a eliminar.
 *     responses:
 *       204:
 *         description: Reserva eliminada con éxito.
 *       404:
 *         description: Reserva no encontrada.
 *       500:
 *         description: Error del servidor.
 */
router.delete("/:email/:index", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const reservationIndex = parseInt(req.params.index);

    // Busca y elimina la reserva en la colección reservationSchema
    const result = await reservationSchema.deleteOne(
      { "user.email": userEmail },
      { $unset: { [`reservations.${reservationIndex}`]: 1 } }
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message:
          "No se encontraron reservas para el usuario o el índice de reserva no es válido",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Reserva eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
