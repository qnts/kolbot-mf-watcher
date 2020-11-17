const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

// set engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'assets/views'));
// sass
app.use(
  sassMiddleware({
    src: __dirname + '/scss',
    dest: __dirname + '/public',
    outputStyle: 'compressed',
    debug: true,
  })
);

app.use(express.static(path.join( __dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home');
});

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
