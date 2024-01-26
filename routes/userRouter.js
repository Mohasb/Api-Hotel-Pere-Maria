const express = require("express");
const router = express.Router();
const userSchema = require("../models/userSchema");
const loginUser = require("./loginRouter");
const verifyToken = require("../Auth/AuthJwtMW");
const authorize = require("../Auth/AutorizationMW");


router.post("/login", loginUser, (req, res) => {
  // Si llegamos aquí, el token se ha verificado correctamente
  res.json({
    error: null,
    data: { token: req.token },
  });
  console.log(req.token);
});

///////////////////////////////////////////////////////////////////////////////////////////////

router.get("/", verifyToken, authorize("admin"), async (req, res) => {
  try {
    const data = await userSchema.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    const data = await userSchema.find({ email });

    if (!data.length) {
      return res
        .status(404)
        .json({ message: `Usuario '${email}' no encontrado` });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const data = new userSchema({
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    reservations: req.body.reservations,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const email = req.body.email;

    const resultado = await userSchema.updateOne(
      { email },
      {
        $set: {
          user_name: req.body.user_name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          reservations: req.body.reservations,
        },
      }
    );

    if (resultado.modifiedCount === 0) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.status(200).json({ message: "Documento actualizado exitosamente" });
  } catch (error) {
    res.status(400).json({ error, message: error.message });
  }
});

module.exports = router;
