"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const https = require("https");
require("dotenv").config();

const PORT = 443;
const app = express();
require("./connection");
const userRouter = require("./routes/userRouter");
const roomRouter = require("./routes/roomRouter");
const redirectToHTTPS = require("./security/securityMW");
/*------------------------------MIDDLEWARES--------------------------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(redirectToHTTPS);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);

app.use("/", (req, res) => {
  res.status(200).send(`<h1>Hotel Pere María Api</h1><br> 
  <p>http://localhost:${PORT}/api/users/getAll</p>
  <p>http://localhost:${PORT}/api/users/getOne/{email}</p>
  <p>http://localhost:${PORT}/api/users/new</p>
  <p>http://localhost:${PORT}/api/users/update</p>
  <p>http://localhost:${PORT}/api/rooms/getAllUnique</p>
  <p>http://localhost:${PORT}/api/rooms/getOneRoom/{type}</p>`);
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
