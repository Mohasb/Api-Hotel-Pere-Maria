const express = require("express");
const router = express.Router();
const rommSchema = require("../models/roomSchema");

router.get("/getAllUnique", async (req, res) => {
  try {
    //const data = await rommSchema.find();
    const uniqueRooms = await rommSchema.aggregate([
      {
        $sort: { price_per_night: 1 }, // Sort by price_per_night in ascending order
      },
      {
        $group: {
          _id: "$type",
          firstRoom: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$firstRoom" },
      },
    ]);
    console.log(uniqueRooms);
    res.status(200).json(uniqueRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
