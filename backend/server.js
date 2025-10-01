import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nikhil:nikhil%40123@cluster0.o5ohf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Database connected successfully ✅");
    app.listen(9090, () => {
      console.log("Server is running on port 9090 🚀");
    });
  } catch (error) {
    console.error("Database connection failed ❌", error);
  }
};
start();
