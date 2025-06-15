import mongoose from "mongoose";

const databasUrl = process.env.DATABASE_URI
const database_name = "swordtalk"

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(`${databasUrl}${database_name}`)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}


export default connectdb