const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
  secret: 'chat-secret',
  resave: false,
  saveUninitialized: true
});

app.use(sessionMiddleware);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.get('/', (req, res) => {
  if (req.session.username) {
    return res.redirect('/chat');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.username = username;
    return res.redirect('/chat');
  }
  res.redirect('/');
});

app.get('/chat', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

io.on('connection', (socket) => {
  const session = socket.request.session;
  const username = session.username;

  socket.emit('message', { user: 'system', text: `Welcome ${username}!` });
  socket.broadcast.emit('message', { user: 'system', text: `${username} joined` });

  socket.on('chat', (msg) => {
    io.emit('message', { user: username, text: msg });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', { user: 'system', text: `${username} left` });
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
