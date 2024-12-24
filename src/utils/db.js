import mongoose from "mongoose";

export default async () => {
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB is already connected");
    return;
  }
  console.log("Connection string is ", "mongodb://localhost:27017/");
  const connection = await mongoose.connect("mongodb://localhost:27017/examp-app");
  return connection;
};
