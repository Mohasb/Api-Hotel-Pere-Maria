const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  extras: {
    type: [
      {
        name: {
          type: String,
          enum: ["wifi", "all_inclusive", "gym", "spa", "parking"],
          required: true,
          description: "Name of the extra service.",
        },
        price: {
          type: Number,
          required: true,
          min: 0,
          description: "Price of the extra service.",
        },
      },
    ],
    validate: {
      validator: function (extras) {
        return extras.length >= 1 && extras.length <= 5;
      },
      message: "Array of extras must have at least 1 item and at most 5 items.",
    },
  },
  user: {
    type: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      user_name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
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
  price_per_night: {
    type: Number,
    required: true,
    min: 0,
  },
  cancelation_date: {
    type: Date,
  },
});

const reservationModel = mongoose.model("reservations", reservationSchema);

module.exports = reservationModel;
