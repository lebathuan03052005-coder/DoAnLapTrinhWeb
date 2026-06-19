import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path"; // Cần import path
import fs from "fs"; // Cần import fs
import multer from "multer"; // Cần import multer
import { fileURLToPath } from "url"; // Cần thiết cho __dirname

import pool from "./database.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// --- CẤU HÌNH UPLOAD ---
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 8) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: ["http://localhost:5173", "https://doanlaptrinhweb-3.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// --- ROUTES & STATIC FILES ---
app.use("/uploads", express.static(uploadDir)); // Phục vụ ảnh từ folder uploads

// API Upload ảnh
app.post("/api/hotels/:id/images", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Chưa chọn file");

    const imageUrl = `/uploads/${req.file.filename}`;
    await pool.query(
      "INSERT INTO hotel_images (hotel_id, image_url) VALUES ($1, $2)",
      [req.params.id, imageUrl],
    );

    res.status(201).json({ image_url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi lưu ảnh vào DB");
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/", bookingRoutes);
app.use("/", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
