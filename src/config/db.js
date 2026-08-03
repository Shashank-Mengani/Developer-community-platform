import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connectionDB = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connect: ${connectionDB.connection.host}`);
    } catch (error) {
        console.error("Error while connecting DB", error.message);
        process.exit(1);
    }
}

export default connectDB;