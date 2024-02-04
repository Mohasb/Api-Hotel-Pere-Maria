"use strict";

// Para usar express
const express = require("express");
// Para usar json
const bodyParser = require("body-parser");
// Para usar https
const fs = require("fs");
const https = require("https");
// Para usar variables de entorno
require("dotenv").config();
require("./connection");

const path = require("path");
const PORT = 443;
const app = express();
const userRouter = require("./routes/users/userRouter");
const roomRouter = require("./routes/rooms/roomRouter");
const reservationRouter = require("./routes/reservations/reservationRouter");
const rateRouter = require("./routes/rates/ratesRouter");

const redirectToHTTPS = require("./security/securityMW");
const { swaggerSpec, swaggerUi } = require("./helpers/swagger");
const { rojo, verde, log } = require("./helpers/colors");
const cors = require('cors');

/*------------------------------MIDDLEWARES--------------------------*/
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(redirectToHTTPS);
app.use("/api/assets", express.static("server/assets"));
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/rates", rateRouter);

/*--------------------------------------------------------------*/

// Cors
var corsOptions = {
  origin: '*', 
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// Cargar los archivos del certificado y la clave privada https
const privateKey = fs.readFileSync("./server/security/host.key", "utf8");
const certificate = fs.readFileSync("./server/security/host.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Crear un servidor HTTPS utilizando Express
const httpsServer = https.createServer(credentials, app);


// Iniciar el servidor HTTPS
httpsServer.listen(PORT, () => {
  log(
    "Servidor HTTPS está escuchando en la ruta: " +
      verde +
      `https://localhost:${PORT}/api-docs`
  );
});

/* app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
  */