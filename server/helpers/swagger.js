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
    "server/routes/login/loginRouter.js",
    "server/routes/users/userRouter.js",
    "server/routes/rooms/roomRouter.js",
    "server/routes/reservations/reservationRouter.js",
    "server/routes/rates/ratesRouter.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
