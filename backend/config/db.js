import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    });

    console.log(
      `Successfully Connected to MongoDB Atlas: ${conn.connection.host}`
    );

    // Connection event listeners
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB Atlas");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB Atlas connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error(`MongoDB Atlas Connection ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
