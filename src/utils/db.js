import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB is already connected");
    return;
  }

  const connection = await mongoose.connect(process.env.MONGO_URL);
  return connection;
};
