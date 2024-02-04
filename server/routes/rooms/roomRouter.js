const express = require("express");
const router = express.Router();
const rommSchema = require("../../models/roomSchema");
require("dotenv");

const baseURL = process.env.BASE_URL_IMAGES || "";

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

    //console.dir(uniqueRoomsWithImageURLs, { depth: null });

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
 *           default: "Individual"
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

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomWithImageURLs = {
      ...room._doc,
      images: room.images.map((image) => ({
        ...image._doc,
        url: `${baseURL}${image.image}.jpg`,
      })),
    };

    res.status(200).json(roomWithImageURLs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/:
 *   post:
 *     summary: Agregar una nueva habitación
 *     description: Agrega una nueva habitación al sistema.
 *     tags: [Habitaciones]
 *     requestBody:
 *       description: Detalles de la nueva habitación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       '201':
 *         description: Habitación agregada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       '400':
 *         description: Solicitud incorrecta.
 *         content:
 *           application/json:
 *             example:
 *               message: "Datos de la habitación incompletos o incorrectos"
 *       '500':
 *         description: Error del servidor
 */
router.post("/", async (req, res) => {
  const roomDetails = req.body;

  try {
    const newRoom = await rommSchema.create(roomDetails);

    const roomWithImageURLs = {
      ...newRoom._doc,
      images: newRoom.images.map((image) => ({
        ...image._doc,
        url: `${baseURL}${image.image}.jpg`,
      })),
    };

    res.status(201).json(roomWithImageURLs);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Datos de la habitación incompletos o incorrectos" });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{type}:
 *   patch:
 *     summary: Actualizar detalles de una habitación por tipo
 *     description: Actualiza los detalles de una habitación específica por tipo.
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           default: "Individual"
 *         description: Tipo de la habitación a actualizar
 *     requestBody:
 *       description: Nuevos detalles de la habitación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       '200':
 *         description: Detalles de la habitación actualizados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       '404':
 *         description: Habitación no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "Room not found"
 *       '500':
 *         description: Error del servidor
 */
router.patch("/:type", async (req, res) => {
  const { type } = req.params;
  const updatedRoomDetails = req.body;

  try {
    const updatedRoom = await rommSchema.findOneAndUpdate(
      { type },
      updatedRoomDetails,
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    const roomWithImageURLs = {
      ...updatedRoom._doc,
      images: updatedRoom.images.map((image) => ({
        ...image._doc,
        url: `${baseURL}${image.image}.jpg`,
      })),
    };

    res.status(200).json(roomWithImageURLs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rooms/{type}:
 *   delete:
 *     summary: Eliminar una habitación por tipo
 *     description: Elimina una habitación específica por tipo.
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           default: "Individual"
 *         description: Tipo de la habitación a eliminar
 *     responses:
 *       '204':
 *         description: Habitación eliminada correctamente.
 *       '404':
 *         description: Habitación no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "Room not found"
 *       '500':
 *         description: Error del servidor
 */
router.delete("/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const deletedRoom = await rommSchema.findOneAndDelete({ type });

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
