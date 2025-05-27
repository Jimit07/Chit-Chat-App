// const mongoose = require('mongoose');
// require("dotenv").config();

// const connectDB = async ()=>{
//     try{
//         const conn = await mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//           });
//         console.log(`Mongoose Connected to ${conn.connection.host}`);
//     }catch(error){
//         console.log(`Error: ${error.message}`);
//         process.exit();
//     }
// }

// module.exports=connectDB;

const mongoose= require('mongoose');


const connectDB = async ()=>{
    try{ 
        const conn= await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDb connected to ${conn.connection.host} `.cyan.underline)

    }catch(error){
        console.error(`Error: ${error.message}`.red.bold)

    }
}

module.exports = connectDB ;