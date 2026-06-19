import express from "express";
import cors from "cors";

// Import các file routes
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// TEST API
app.get("/", (req, res) => {
  res.send("SERVER OK");
});

// Đăng ký routes
// Lưu ý: Các route trong file booking.js và admin.js sẽ giữ nguyên đường dẫn
app.use("/", bookingRoutes);
app.use("/", adminRoutes);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
