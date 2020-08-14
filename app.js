import express from 'express';
import cors from 'cors';
import http from 'http';
import io from 'socket.io';
import handlebars from 'express-handlebars';

const app = express();
http.createServer(app);
const socket = io(http);

app.use(express.json());
app.use(cors());
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

socket.on('connection', (socket) => {
  console.log(' connected');
});

app.post('/teste-form', (req, res) => {
  console.log(req.body);
  socket.emit('event', {
    someProperty: 'some value',
    otherProperty: 'other value',
  });
  res.render('layouts/main', { body: 'Olá, mundo!' });
});

app.get('/', (req, res) => {
  return res.render('layouts/main');
});

app.listen(8080, () => {
  console.log('Conectado');
});
