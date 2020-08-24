import mongoose from "mongoose";
const env = process.env.NODE_ENV;

import * as url from "../util/url";

export function connect() {
  console.log(url.MONGO_DB_CONNECTION);
  console.log(env);
  mongoose.connect(url.MONGO_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("connected", function () {
    console.log("Conecatdo ao MongoDB");
  });
  mongoose.connection.on("error", function () {
    console.log("Erro ao conectar ao MongoDB");
  });
}
