const express = require("express");
const router = express.Router();
const rateSchema = require("../../models/rateSchema");

/**
 * @swagger
 * tags:
 *   name: Reseñas
 *   description: Endpoints relacionados con la gestión de reseñas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email del usuario que envió la reseña.
 *             name:
 *               type: string
 *               description: Nombre del usuario que envió la reseña.
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Valor de calificación para el elemento revisado (1 a 5).
 *         comment:
 *           type: string
 *           description: Texto del comentario o reseña.
 *         room_type:
 *           type: string
 *           description: Tipo de habitación.
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha de la reseña.
 */

/**
 * @swagger
 * /api/rates:
 *   get:
 *     summary: Obtiene todas las reseñas
 *     description: Endpoint para obtener todas las reseñas.
 *     tags: [Reseñas]
 *     responses:
 *       200:
 *         description: Devuelve todas las reseñas con sus detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Error del servidor
 */
router.get("/", async (req, res) => {
  try {
    const reviews = await rateSchema.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rates:
 *   post:
 *     summary: Agrega una nueva reseña
 *     description: Agrega una nueva reseña al sistema.
 *     tags: [Reseñas]
 *     requestBody:
 *       description: Detalles de la nueva reseña
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '201':
 *         description: Reseña agregada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Solicitud incorrecta.
 *         content:
 *           application/json:
 *             example:
 *               message: "Datos de la reseña incompletos o incorrectos"
 *       '500':
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
  const reviewDetails = req.body;

  try {
    const newReview = await rateSchema.create(reviewDetails);
    res.status(201).json(newReview);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Datos de la reseña incompletos o incorrectos" });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rates/{email}:
 *   get:
 *     summary: Obtiene una reseña por email
 *     description: Endpoint para obtener los detalles de una reseña por su email de usuario.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario para buscar la reseña
 *     responses:
 *       '200':
 *         description: Devuelve los detalles de la reseña asociada al email especificado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       '404':
 *         description: Reseña no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "Review not found for the specified email"
 *       '500':
 *         description: Error del servidor
 */
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const review = await rateSchema.findOne({ "user.email": email });

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found for the specified email" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rates/{email}:
 *   patch:
 *     summary: Actualiza detalles de una reseña por email
 *     description: Actualiza los detalles de una reseña específica por su email de usuario.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario asociado a la reseña a actualizar.
 *     requestBody:
 *       description: Nuevos detalles de la reseña
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       '200':
 *         description: Detalles de la reseña actualizados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       '404':
 *         description: Reseña no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "Review not found for the specified email"
 *       '500':
 *         description: Error del servidor
 */
router.patch("/:email", async (req, res) => {
  const { email } = req.params;
  const updatedReviewDetails = req.body;

  try {
    const updatedReview = await rateSchema.findOneAndUpdate(
      { "user.email": email },
      updatedReviewDetails,
      { new: true }
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ message: "Rate not found for the specified email" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reviews/{email}:
 *   delete:
 *     summary: Elimina una reseña por email
 *     description: Elimina una reseña específica por el email asociado.
 *     tags: [Reseñas]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del usuario asociado a la reseña a eliminar.
 *     responses:
 *       '204':
 *         description: Reseña eliminada correctamente.
 *       '404':
 *         description: Reseña no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "Review not found for the specified email"
 *       '500':
 *         description: Error del servidor
 */
router.delete("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const deletedReview = await rateSchema.findOneAndDelete({ "user.email": email });

    if (!deletedReview) {
      return res
        .status(404)
        .json({ message: "Rate not found for the specified email" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
