const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes.js");
const messageRoutes = require("./Routes/messageRoutes.js");

const { notFound, errorHandler } = require("./middleWare/errorMiddleware.js");
const path = require('path')

const colors = require("colors");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data

// app.get("/", (req, res) => {
//   res.send("Api is running succesfully");
// });
// api for creatin user
app.use("/api/user", userRoutes);

// api for chat
app.use("/api/chat", chatRoutes);

//api for message sending
app.use("/api/message", messageRoutes);




// ------------------------------------Deployment----------------------------------------------


// const __dirname = path.resolve();
// if(process.env.NODE_ENV == "production"){

//   app.use(express.static(path.join(__dirname , "/frontend1/build")))

//   app.get('*' , (req,res)=>{
//     res.sendFile(path.resolve(__dirname , "frontend1" , "build" , "index.html"));
//   })

// }else{
//   app.get("/", (req,res)=>{
//     res.send("API is Running successfully")

//   })
// }

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend1", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend1", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running successfully");
  });
}







//---------------------------------------Deployment---------------------------------------------------




app.use(notFound);

app.use(errorHandler);

// https://api.cloudinary.com/v1_1/dq00oidou/image/upload

// app.get('/api/chat' , (req,res)=>{
//     res.send(chats)
// })

// app.get('/api/chat/:id', (req,res)=>{
//     console.log(req);
// })

// app.get("/api/chat/:id", (req,res)=>{
//     // console.log(req.params.id);
//     const singleChat=(chats.find(c=>c._id===req.params.id));
//     res.send(singleChat);
// })

// console.log("MONGO_URI from .env:", process.env.MONGO_URI);



const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running at port ${PORT}`.yellow.bold)
);

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000", // use http not https unless you have SSL
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     console.log("User joined setup with ID:", userData._id);
//     socket.emit("connected");
//   });


//    socket.on("join chat" , (room)=>{
//     socket.join(room);
//     console.log("User joined room:", room );
//    } );

// //   // Optional: handle disconnection
// //   socket.on("disconnect", () => {
// //     console.log("User disconnected");
// //   });
// });

// socket.on("new message" , (newMessageReceived)=>{
//   var chat =newMessageReceived.chat;

//   if(!chat.users)return console.log("chat.users not defined");

//   chat.users.array.forEach(user => {
//     if(user._id === newMessageReceived.sender._id)return;

//     socket.in(user._id).emit("message received", newMessageReceived);

    
//   });
// });

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");

  // Setup event
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("User joined setup with ID:", userData._id);
    socket.emit("connected");
  });

  // Join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User joined room:", room);
  });

  // room for typing

  socket.on("typing" , room =>{socket.in(room).emit("typing")});
  socket.on("stop typing", room =>{socket.in(room).emit("stop typing")});

  //  Move new message here
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // disconnect log
  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});
