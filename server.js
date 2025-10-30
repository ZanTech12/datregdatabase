// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// --- Import Routes ---
import studentRoutes from "./routes/studentRoutes.js";

// --- Import Models (ensures they're registered with Mongoose) ---
import "./models/Student.js";

dotenv.config();

// --- Directory setup for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Initialize Express ---
const app = express();

// --- Vercel / External Access CORS Setup ---
const allowedOrigins = [
    "https://https://dislform.vercel.app/" // <-- replace with your Vercel frontend URL
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Optional: log external requests ---
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.originalUrl} from ${req.ip}`);
    next();
});

// --- Serve Uploaded Files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api/students", studentRoutes);

// --- Root Route ---
app.get("/", (req, res) => {
    res.send("📚 School Management API is running...");
});

// --- 404 Handler ---
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal server error", details: err.message });
});

// --- MongoDB Connection ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/signupsch";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
