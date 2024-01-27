const express = require("express");
const router = express.Router();
const rommSchema = require("../../models/roomSchema");

const baseURL = "https://localhost/api/assets/roomImages/";

/**
 * @swagger
 * tags:
 *   name: Habitaciones
 *   description: Endpoints relacionados con la gestión de Habitaciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         room_number:
 *           type: integer
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               image1:
 *                 type: string
 *               image2:
 *                 type: string
 *               image3:
 *                 type: string
 *         price_per_night:
 *           type: number
 *         rate:
 *           type: number
 *         max_occupancy:
 *           type: integer
 *         isAvailable:
 *           type: boolean
 */

/**
 * @swagger
 * /api/rooms/:
 *   get:
 *     summary: Obtiene todas las habitaciones
 *     description: Endpoint para obtener todas las habitaciones.
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *         description: Devuelve todas las habitaciones con sus detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Error del servidor
 */

router.get("/", async (req, res) => {
  try {
    const rooms = await rommSchema.find();

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/unique-rooms:
 *   get:
 *     summary: Obtiene habitaciones únicas
 *     description: Endpoint para obtener las habitaciones únicas ordenadas por precio por noche.
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *         description: Devuelve las habitaciones únicas con sus detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       500:
 *         description: Error del servidor
 */

router.get("/unique-rooms", async (req, res) => {
  try {
    const uniqueRooms = await rommSchema.aggregate([
      {
        $group: {
          _id: "$type",
          firstRoom: { $first: "$$ROOT" }, // Tomar el primer documento de cada grupo
        },
      },
      {
        $replaceRoot: { newRoot: "$firstRoom" }, // Reemplazar la raíz con el primer documento de cada grupo
      },
      {
        $sort: { price_per_night: 1 }, // Ordenar por price_per_night
      },
    ]);

    const uniqueRoomsWithImageURLs = uniqueRooms.map((room) => {
      console.log("Original room:", room);

      const roomCopy = {
        ...room,
        //_id: room._id.toString(),
        images: room.images.map((image) => ({
          ...image,
          url: `${baseURL}${Object.values(image)[0]}.jpg`,
        })),
      };
      return roomCopy;
    });

    console.dir(uniqueRoomsWithImageURLs, { depth: null });

    res.status(200).json(uniqueRoomsWithImageURLs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{type}:
 *   get:
 *     summary: Obtiene detalles de una habitación por tipo
 *     description: Endpoint para obtener los detalles de una habitación específica por tipo.
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: Tipo de la habitación a buscar
 *     responses:
 *       200:
 *         description: Devuelve los detalles de la habitación especificada por tipo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       500:
 *         description: Error del servidor
 */
router.get("/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const room = await rommSchema.findOne({ type });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
