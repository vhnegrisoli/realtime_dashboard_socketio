import express from "express";
import http from "http";
import cors from "cors";
import handlebars from "express-handlebars";

import * as socketConfig from "./src/config/socket/index";
import * as db from "./src/config/db/index";
import dashboard from "./src/modulos/dashboard/routes/index";

const app = express();
const server = http.Server(app);

socketConfig.connect(server);
db.connect();

app.use(express.json());
app.use(cors());
app.engine("handlebars", handlebars({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(dashboard);

server.listen(8080);
