import express from 'express';
import http from 'http';
import io from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import handlebars from 'express-handlebars';

const app = express();
const server = http.Server(app);
const socketIO = io(server);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

app.post('/', (req, res) => {
  const { labels, data } = req.body;
  let values = {
    labels,
    data,
  };
  socketIO.emit('dados', values);
  return res.json({ message: 'Enviado!' });
});

app.get('/dashboard', (req, res) => {
  return res.render('dashboard', { layout: false, card1: 0, card2: 0, card3: 0, card4: 0 });
});

socketIO.on('connection', function (socket) {
  console.log('Usuário ' + socket.id + ' conectado.');
  socket.on('disconnect', (reason) => {
    console.log('Usuário ' + socket.id + ' desconectado.');
  });
});

server.listen(8080);
