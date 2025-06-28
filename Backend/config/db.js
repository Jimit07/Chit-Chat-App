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