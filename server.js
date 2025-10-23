// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import studentRoutes from "./routes/studentRoutes.js";

// Models
import Student from "./models/Student.js"; // ✅ Ensures model is registered

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/students", studentRoutes);

// Default route
app.get("/", (req, res) => res.send("📚 Student Management API running..."));

// --- MongoDB connection ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/signupsch";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Start server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
