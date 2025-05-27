const express = require('express');

const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes.js')





const { notFound , errorHandler}= require('./middleWare/errorMiddleware.js')

const colors = require('colors')


dotenv.config();
connectDB();
const app = express();


app.use(express.json()); // to accept json data



app.get('/', (req ,res)=>{
    res.send("Api is running succesfully")

})
// api for creatin user
app.use('/api/user', userRoutes)

// api for chat
app.use('/api/chat', chatRoutes)


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


const PORT = process.env.PORT || 5000

app.listen( PORT , console.log(`Server running at port ${PORT}`.yellow.bold))




