import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Cấu hình kết nối cho PostgreSQL trên Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Bắt buộc khi dùng Postgres trên Render
  },
  // Tune pool to reduce transient connection resets
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Kiểm tra kết nối khi app khởi động
pool.on("connect", () => {
  console.log("Đã kết nối thành công với Database PostgreSQL!");
});

pool.on("error", (err) => {
  console.error("Lỗi kết nối database:", err.stack);
});

/**
 * Safe query helper: always release client back to the pool in finally.
 * Use this helper in code that needs to acquire a client directly.
 */
async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } catch (err) {
    // Re-throw after logging
    console.error("Query error:", err.stack || err);
    throw err;
  } finally {
    try {
      client.release();
    } catch (releaseErr) {
      console.error("Error releasing client:", releaseErr);
    }
  }
}

process.on("exit", () => {
  pool.end();
});

export { pool, query };
export default pool;
