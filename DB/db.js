import mongoose from "mongoose";

async function connectDB(){
   try {
       const database = await mongoose.connect(`${process.env.MONGODB_URL}${process.env.DATABASE_NAME}`)
       console.log("Database Connected Successfully !")
   } catch (error) {
        console.log("Database Connection Error !")
   }
}

export default connectDB 