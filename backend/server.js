import express from "express";
import cors from "cors";
import pg from "pg";
import "dotenv/config";

// Import các routes của bạn
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const { Pool } = pg;
const app = express();

// 1. CẤU HÌNH CORS (Quan trọng: Phải cho phép domain của Frontend gọi vào)
// Thay '*' bằng URL Frontend của bạn khi bạn đã deploy xong Static Site
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// 2. CẤU HÌNH KẾT NỐI POSTGRESQL (Dùng cho cả Render và Local)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Kiểm tra kết nối database ngay khi khởi động
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Lỗi kết nối database:", err.stack);
  }
  console.log("Kết nối Database thành công!");
  release();
});

// 3. ROUTES
app.get("/", (req, res) => {
  res.send("SERVER OK - Booking_Web API");
});

app.use("/api/bookings", bookingRoutes); // Nên có prefix /api để quản lý tốt hơn
app.use("/api/admin", adminRoutes);

// 4. XỬ LÝ LỖI (Dành cho các request không tồn tại)
app.use((req, res, next) => {
  res.status(404).send("Endpoint không tồn tại!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});

// Xuất pool để các file khác (booking.js, admin.js) dùng
export default pool;
