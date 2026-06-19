import express from "express";
import cors from "cors";
import pg from "pg";
import "dotenv/config";

// Import các routes (đảm bảo file routes không import 'mssql')
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const { Pool } = pg;
const app = express();

// Allow local Vite dev server and the deployed frontend on Render
const allowedOrigins = [
  "http://localhost:5173",
  "https://doanlaptrinhweb-1-utii.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

// CHỈ SỬ DỤNG DATABASE_URL - KHÔNG DÙNG CÁC BIẾN DB_USER/DB_PASSWORD CŨ
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Kiểm tra kết nối
pool
  .connect()
  .then(() => console.log("Kết nối Database PostgreSQL thành công!"))
  .catch((err) => console.error("Lỗi kết nối Database:", err));

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

app.use("/", bookingRoutes);
app.use("/", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});

export default pool;
