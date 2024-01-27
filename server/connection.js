const mongoose = require("mongoose");
const DatabaseUrl = process.env.DATABASE_URL;
const { rojo, verde, print } = require("./helpers/colors");

try {
  mongoose.connect(DatabaseUrl);
  const database = mongoose.connection;

  database.on("error", (error) => {
    print(rojo + `Error conectando a la base de datos: ${error.code}`);
    if (error.message && error.message.includes("timeout")) {
      print(
        rojo + "Error timeout en la conexon a la base de datos:",
        error.code
      );
    }
  });

  database.on("connected", () => {
    print(verde + "Conectado a la base de datos correctamente");
  });
} catch (error) {
  print(rojo + `Error during database connection: ${error}`);
}
