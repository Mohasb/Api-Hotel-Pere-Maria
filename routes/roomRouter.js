const express = require("express");
const router = express.Router();
const rommSchema = require("../models/roomSchema");

router.get("/getAllUnique", async (req, res) => {
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

router.get("/getOneRoom/:type", async (req, res) => {
  
  const { type } = req.params;

  try {
    const room = await rommSchema.findOne({ type });
    console.log(room);
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
