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

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Serve Uploaded Files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api/students", studentRoutes);

// --- Root Route ---
app.get("/", (req, res) => {
    res.send("📚 School Management API is running...");
});

// --- MongoDB Connection ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/signupsch";

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
