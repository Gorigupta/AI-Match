import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || true }));
app.use(express.json({ limit: "2mb" }));
app.get("/", (req, res) => res.json({ message: "AI Match API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch(err => { console.error("Database connection failed:", err.message); process.exit(1); });