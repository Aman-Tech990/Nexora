// All imports
import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

// dotenv
if (process.env.NODE_ENV !== "production") {
    dotenv.config({});
}

// App configured
const app = express();
const PORT = process.env.PORT || 5050;

// Default Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// CORS Setup
const corsOptions = ({
    origin: "http://localhost:5173",
    credentials: true
});
app.use(cors(corsOptions));

// Database Setup
connectDB();

// APIs
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// App Entry Point
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});