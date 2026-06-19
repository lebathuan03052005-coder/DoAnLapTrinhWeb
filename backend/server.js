import express from "express";
import cors from "cors";
import "dotenv/config";

import pool from "./database.js"; // dùng chung pool từ database.js
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const app = express();

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

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

app.use("/", bookingRoutes);
app.use("/", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});
