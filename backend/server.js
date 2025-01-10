import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from './routes/post.routes.js';
import userRoutes from './routes/user.routes.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));


const start = async () => {
  const connectDB = await mongoose.connect(
    "mongodb+srv://nikhilko07:2407@cluster0.o5ohf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  app.listen(9090,()=>{
    console.log("server is running on 9090")
  })
};
start();
