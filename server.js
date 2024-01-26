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
const userRouter = require("./routes/userRouter");
const roomRouter = require("./routes/roomRouter");
const redirectToHTTPS = require("./security/securityMW");
const verifyToken = require("./Auth/AuthJwtMW");
/*------------------------------MIDDLEWARES--------------------------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(redirectToHTTPS);

//Auth

app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
/*--------------------------------------------------------------*/

// Cargar los archivos del certificado y la clave privada
const privateKey = fs.readFileSync("./security/host.key", "utf8");
const certificate = fs.readFileSync("./security/host.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Crear un servidor HTTPS utilizando Express
const httpsServer = https.createServer(credentials, app);

// Iniciar el servidor HTTPS
httpsServer.listen(PORT, () => {
  console.log(
    `Servidor HTTPS está escuchando en la ruta: https://localhost:${PORT}`
  );
});
