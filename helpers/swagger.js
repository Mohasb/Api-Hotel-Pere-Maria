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
    "./routes/users/userRouter.js",
    "./routes/rooms/roomRouter.js",
    "./routes/login/loginRouter.js",
  ], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
