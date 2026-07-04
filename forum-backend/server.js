import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import forumRoutes from './routes/forum';
import errorHandler from './middleware/errorHandler';
import {
    mongoURI,
    port,
    rateLimitWindowMs,
    rateLimitMax,
} from './config/db';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: rateLimitWindowMs,
    max: rateLimitMax,
    message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Forum API is running",
        version: "1.0.0",
    });
});

app.use("/api", forumRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use(errorHandler);

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();

const server = app.listen(port, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`
    );
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    server.close(() => process.exit(1));
});
