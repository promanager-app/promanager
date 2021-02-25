const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const projects = require("./routes/api/projects");
const tasks = require("./routes/api/tasks");
const discuss = require("./routes/api/discuss")

const app = express();
var http = require('http').createServer(app);

var cors = require('cors');
app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;
const Chat = require("./models/Chat");
const Room = require("./models/Room");
const User = require("./models/User");

// Connect to MongoDB
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/projects", projects);
app.use("/api/tasks", tasks);
app.use("/api/room", discuss)

// Serve static assets (build folder) if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

// discussions
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
  // console.log(`Client ${socket.id} connected`);

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    exports.discuss = async (req, res) => {
      const xyz = await Room.findOne({ room: roomId })

      msg = new Chat({
        sender: data.senderId,
        message: data.body,
        username: data.username,
        date: new Date()
      })

      await msg.save()
      xyz.chats.push(msg)
      await xyz.save()
    }
    this.discuss()
  })


  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    // console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});

http.listen(port, () => console.log(`Server up and running on port ${port}`));