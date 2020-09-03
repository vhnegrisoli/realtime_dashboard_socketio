import express from 'express';
import http from 'http';
import cors from 'cors';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';

import * as socketConfig from './config/socket/index';
import * as db from './config/db/index';
import dashboard from './modulos/dashboard/routes/index';
import categorias from './modulos/produto/routes/categoriaRoutes';
import fornecedores from './modulos/produto/routes/fornecedorRoutes';
import produtos from './modulos/produto/routes/produtoRoutes';
import vendas from './modulos/venda/routes/index';
import usuarios from './modulos/usuario/routes/usuarioRoutes';
import usuarioPublicApi from './modulos/usuario/routes/usuarioPublicRoutes';
import auth from './modulos/usuario/routes/authRoutes';
import checkToken from './config/auth/checkToken';

const app = express();
const server = http.Server(app);

socketConfig.connect(server);
db.connect();

app.use(express.json());
app.use(cors());
app.engine('handlebars', handlebars({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.use(express.static('.'));
app.use(cookieParser());
app.use(auth);
app.use(usuarioPublicApi);

app.use(checkToken);

app.use(dashboard);
app.use(categorias);
app.use(vendas);
app.use(produtos);
app.use(fornecedores);
app.use(usuarios);

const PORT = process.env.PORT || 8080;

server.listen(PORT);
