import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    console.log("📡 Connecting to MongoDB Atlas...");

    // Simple connect - no deprecated options
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`📚 Database Name: ${conn.connection.db.databaseName}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed!");
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
