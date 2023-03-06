const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { generateMesage } = require("./utils/message");
const { generateLocationLink } = require("./utils/location");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");

const app = express();
const publicPath = path.join(__dirname, "./../public");
const server = http.createServer(app);
const io = new Server(server);
var users = new Users();
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(publicPath + "/index.html");
});

io.on("connection", (socket) => {
  console.log("server connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("name and room must be required");
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit("newMessage", generateMesage("Admin", "Welcome to Chat app"));

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMesage("Admin", `${params.name} has joined chat`)
      );

    callback();
  });

  socket.on("createMessage", (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMesage(user.name, message.text)
      );
    }
    callback("This is from server");
    // console.log("Message", message);
    // io.emit("newMessage",{
    //   from : message.from,
    //   text : message.text,
    //   createdAt : new Date().getTime(),
    // });
    // socket.broadcast.emit("newMessage", generateMesage(message.from, message.text));
  });

  socket.on("createLocationMessage", (coords) => {
    console.log(coords);
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newLocationMessage",
        generateLocationLink(user.name, coords.latitude, coords.longitude)
      );
    }
  });

  socket.on("disconnect", function () {
    var user = users.removeUser(socket.id);
    console.log("server disconnected");

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(
        "newMessage",
        generateMesage("Admin", `${user.name} has left chat`)
      );
    }
  });
});

// socket.on("join",  function (params, callback) {
//   console.log("server disconnected");
// });

server.listen(3003, function () {
  console.log("listening on *:3003");
});



