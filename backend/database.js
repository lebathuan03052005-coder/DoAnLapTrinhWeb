import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Cấu hình kết nối cho PostgreSQL trên Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Bắt buộc khi dùng Postgres trên Render
  },
});

// Kiểm tra kết nối khi app khởi động
pool.on("connect", () => {
  console.log("Đã kết nối thành công với Database PostgreSQL!");
});

pool.on("error", (err) => {
  console.error("Lỗi kết nối database:", err.stack);
});

export default pool;
