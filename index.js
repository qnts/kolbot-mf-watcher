import express from 'express';
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
import { join } from 'path';
import session from 'express-session';
import { json } from 'body-parser';
import morgan from 'morgan';
import { config } from './services/env';
import channelsController from './controllers/channels';
import itemsController from './controllers/items';
import './models/mongo';

app.use(morgan('dev'));
// set engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'assets/views'));
app.use(express.static(join( __dirname, 'public')));
// session
app.use(session({ secret: config.sessionKey }));
app.use(json());

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/api/channels', channelsController);
app.use('/api/items', itemsController);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('new_item', item => {
    console.log('receiving new item', item);
    socket.broadcast.emit('new_item', item);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
