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
        $sort: { price_per_night: 1 }, // Volver a ordenar por price_per_night (opcional)
      },
    ]);
    console.log(uniqueRooms);
    res.status(200).json(uniqueRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
