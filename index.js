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
import { Liquid } from 'liquidjs';
import './models/mongo';

const templateRoot = join(__dirname, 'assets/views');
const liquid = new Liquid({
  extname: '.liquid',
  globals: {
    app: {
      name: config.appName,
    },
  },
});
liquid.registerFilter('document_title', v => v ? `${v} - ${config.appName}` : config.appName);

app.use(morgan('dev'));
// set engine
app.engine('liquid', liquid.express());
app.set('view engine', 'liquid');
app.set('views', templateRoot);

app.use(express.static(join( __dirname, 'public')));
// session
app.use(session({ secret: config.sessionKey }));
app.use(json());

app.get('/', (req, res) => {
  console.log(req.session);
  res.render('home', { channel: req.session.channel });
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
