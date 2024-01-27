const mongoose = require("mongoose");
const DatabaseUrl = process.env.DATABASE_URL;

const rojo = "\x1b[31m";
const reset = "\x1b[0m";
const verde = "\x1b[32m";

try {
  mongoose.connect(DatabaseUrl);
  const database = mongoose.connection;

  database.on("error", (error) => {
    console.error(
      rojo + "Error conectando a la base de datos:",
      error.code + reset
    );
    if (error.message && error.message.includes("timeout")) {
      console.log(
        rojo + "Error timeout en la conexon a la base de datos:",
        error.code + reset
      );
    }
  });

  database.on("connected", () => {
    console.log(verde + "Conectado a la base de datos correctamente" + reset);
  });
} catch (error) {
  console.error(rojo + "Error during database connection:" + reset, error);
}
