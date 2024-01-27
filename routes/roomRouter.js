const express = require("express");
const router = express.Router();
const rommSchema = require("../models/roomSchema");

router.get("/", async (req, res) => {
  try {
    const rooms = await rommSchema.find()

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

    res.status(200).json(uniqueRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:type", async (req, res) => {
  
  const { type } = req.params;

  try {
    const room = await rommSchema.findOne({ type });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//router.post(/new ) -----------> anadir habitacion -> wpf

//router.post(/reserva ) -----------> anadir habitacion -> wpf y android


module.exports = router;
