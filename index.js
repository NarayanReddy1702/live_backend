import app from "./app.js";
import connectDB from "./DB/db.js";


const port = process.env.PORT 

app.listen(port,()=>{
    connectDB()
    console.log(`App is Runing on Port ${port}`)
})