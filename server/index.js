const express = require('express');
const path = require('path')  // build-in nodejs
const socketIO = require('socket.io');
const http = require('http'); // build-in nodejs

const app = express();
const server = http.createServer(app);

const Room = require('./../server/models/Room');
const _room = new Room();

const { generateMessage } = require('./utils/message');

// const publicPath = path.join(__dirname, '..', 'public')
const publicPath = path.join(__dirname + './../public')


app.use(express.static(publicPath))
const port = process.env.PORT || 5000;

io = socketIO(server);
io.on('connection', socket => {
  console.log('New user join');
  socket.on('Info_From_Client_To_Server', msg => {
    const { name, room } = msg;
    _room.createUser(
      socket.id,
      name,
      room
    )
    socket.join(room);
    io.to(room).emit('User_List', {
      users: _room.getUserByRoom(room)
    })
    socket.emit('From_Server_To_Client', generateMessage('Admin', 'Welcome to CyberChat', new Date()));
    socket.broadcast.to(room).emit('From_Server_To_Client', generateMessage('Admin', `${name} join to CyberChat`, new Date()))
    socket.on('disconnect', () => {
      const removeUser = _room.removeUser(socket.id);
      if(removeUser) {
        io.to(room).emit('User_List', {
          users: _room.getUserByRoom(room)
        });
        io.to(room).emit('From_Server_To_Client', generateMessage('Admin', `${name} is leave group`, new Date().getTime()));
      }
    });
    socket.on('From_Client_To_Server', (data, callback) => {
      io.to(room).emit('From_Server_To_Client', data); //1-n: gui den tat ca socket
      callback("the message has been seen")
    })
    socket.on('Location_From_Client_To_Server', msg => {
      io.to(room).emit("Location_From_Server_To_Client", msg)
    })
  })
  // socket.emit('From_Server_To_Client', {
  //   text: 'Hello user',
  //   from: "admin",
  //   createdAt: new Date()
  // })
  
})

server.listen(port, () => {
  console.log( `app is running on port ${port}`)
}
);