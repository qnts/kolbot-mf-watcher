import express from 'express';
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
import { join } from 'path';
import expressSession from 'express-session';
import sharedSession from 'express-socket.io-session';
import { json } from 'body-parser';
import morgan from 'morgan';
import { config } from './services/env';
import channelsController from './controllers/channels';
import itemsController from './controllers/items';
import { Liquid } from 'liquidjs';
import './models/mongo';
import * as gameData from './services/GameData';

const session = expressSession({
  secret: config.sessionKey,
  resave: true,
  saveUninitialized: true,
});
// session
app.use(session);
// io middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

const templateRoot = join(__dirname, 'assets/views');
const liquid = new Liquid({
  extname: '.liquid',
  globals: {
    app: {
      name: config.appName,
    },
    gameData,
  },
});
liquid.registerFilter('document_title', v => v ? `${v} - ${config.appName}` : config.appName);

app.use(morgan('dev'));
// set engine
app.engine('liquid', liquid.express());
app.set('view engine', 'liquid');
app.set('views', templateRoot);

app.use(express.static(join( __dirname, 'public')));
app.use(json());

app.get('/', (req, res) => {
  if (req.session.channel) {
    res.render('home', { currentPage: 'home', channel: req.session.channel });
  } else {
    res.render('channel');
  }
});

app.get('/inventory', (req, res) => {
  if (req.session.channel) {
    res.render('inventory', { currentPage: 'inventory', channel: req.session.channel });
  } else {
    res.redirect('/');
  }
});

app.use('/api/channels', channelsController);
app.use('/api/items', itemsController);

io.use(sharedSession(session, {
  autoSave:true
}));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  // frontend channel because they share the same session
  socket.on('room join', () => {
    const channel = socket.handshake.session.channel;
    if (channel) {
      socket.join(String(channel._id));
      console.log('[front] joined', channel._id);
      socket.emit('room join', 1);
    } else {
      socket.emit('room join', 0);
    }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
