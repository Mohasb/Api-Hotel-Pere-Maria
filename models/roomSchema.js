const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({});

const roomModel = mongoose.model("rooms", roomSchema);

module.exports = roomModel;
