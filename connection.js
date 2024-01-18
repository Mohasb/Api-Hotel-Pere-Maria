const mongoose = require("mongoose");
const DatabaseUrl = process.env.DATABASE_URL;

mongoose.connect(DatabaseUrl);
const database = mongoose.connection;

database.on("error", (e) => {
  console.log(e);
  console.log("Error connecting Database");
});
database.on("connected", () => {
  console.log("Database Connected");
});
database.on('timeout', function(e) {
  console.log("db: mongodb timeout "+ e);
});