import mongoose from "mongoose";

const DB_Connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    console.log("Mongoose Connected Host", mongoose.connection.host);
  } catch (err) {
    console.log("DataBase Connection Error", err);
    process.exit(1);
  }
};

export default DB_Connect;
