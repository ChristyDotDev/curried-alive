const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS", "PUT"]
    }
});

const port = process.env.PORT || 3001;

const joinedUsers = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('joined', user => {
    console.log('User joined: ', user);
    joinedUsers.push(user);
  });
  socket.on('action', user => {
    console.log('Action by: ', user);
  });
  socket.on('createGame', gameId => {
    console.log('Create Game: ', gameId);
    socket.join(gameId);
    io.to(gameId).emit("joinedGame", gameId)
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});