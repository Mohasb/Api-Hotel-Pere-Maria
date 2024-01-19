"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT | 3000;
const app = express();
require("./connection");
const userRouter = require("./routes/userRouter");
const roomRouter = require("./routes/roomRouter");
/*------------------------------MIDDLEWARES--------------------------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
/*------------------------------SWAGGER--------------------------*/

app.use("/", (req, res) => {
  res.status(200).send(`<h1>Hotel Pere María Api</h1><br> 
  <p>http://localhost:${PORT}/api/users/getAll</p>
  <p>http://localhost:${PORT}/api/users/getOne/{email}</p>
  <p>http://localhost:${PORT}/api/users/new</p>
  <p>http://localhost:${PORT}/api/users/update</p>
  <p>http://localhost:${PORT}/api/rooms/getAllUnique</p>`);
});
/*--------------------------------------------------------------*/
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
