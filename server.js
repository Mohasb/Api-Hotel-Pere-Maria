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
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
/*------------------------------MIDDLEWARES--------------------------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
/*------------------------------SWAGGER--------------------------*/
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Hotel Pere María Intermodular Api",
      version: "0.1.0",
      description: "Api for Hotel Pere María",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Muhammad",
        url: "https://github.com/Mohasb",
        email: "mh.haidor@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use("/", swaggerUi.serve, swaggerUi.setup(specs));
/*--------------------------------------------------------------*/
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
