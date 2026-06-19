import express from "express";
import cors from "cors";
import pg from "pg";
import "dotenv/config";

import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const { Pool } = pg;
const app = express();

// 1. Cấu hình CORS duy nhất - CHỈ MỘT LẦN
const allowedOrigins = [
  "http://localhost:5173",
  "https://doanlaptrinhweb-3.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// 2. Cấu hình DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => console.log("Kết nối Database PostgreSQL thành công!"))
  .catch((err) => console.error("Lỗi kết nối Database:", err));

// 3. Health check endpoint (Giúp bạn kiểm tra server sống hay chết)
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

app.use("/", bookingRoutes);
app.use("/", adminRoutes);

// 4. Sửa lỗi undefined port bằng cách dùng || 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});

export default pool;
