const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  room_number: {
    type: Number,
    required: true,
  },
  check_in_date: {
    type: Date,
    required: true,
  },
  check_out_date: {
    type: Date,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  reservations: [reservationSchema],
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
