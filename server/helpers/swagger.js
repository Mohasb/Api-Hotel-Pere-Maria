const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Pere Maria API",
      version: "1.0.0",
    },
  },
  apis: [
    "server/routes/users/userRouter.js",
    "server/routes/rooms/roomRouter.js",
    "server/routes/login/loginRouter.js",
    "server/routes/reservations/reservationRouter.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
