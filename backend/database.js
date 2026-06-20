import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Helper to create a pool with or without SSL
function createPool(useSSL = false) {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

// Start with non-SSL pool and upgrade if server requires TLS
let pool = createPool(false);

async function tryConnectAndMaybeUpgrade() {
  try {
    const client = await pool.connect();
    client.release();
    console.log("Đã kết nối thành công với Database PostgreSQL (non-SSL)");
  } catch (err) {
    console.warn("Initial DB connect failed:", err.message || err);
    if (/ssl|tls/i.test(err.message || "")) {
      console.log("Server requires SSL — retrying with SSL enabled");
      // create new pool first, then end the old one to avoid racing other modules
      const newPool = createPool(true);
      try {
        const client = await newPool.connect();
        client.release();
        // swap pools (do not call end() on old pool to avoid 'pool ended' races)
        pool = newPool;
        console.log(
          "Đã kết nối thành công với Database PostgreSQL (SSL enabled)",
        );
      } catch (err2) {
        console.error(
          "Kết nối DB thất bại sau khi bật SSL:",
          err2.message || err2,
        );
      }
    } else {
      console.error("Kết nối DB thất bại:", err.message || err);
    }
  }
}

// Run the connect attempt but don't block module load
tryConnectAndMaybeUpgrade().catch((e) => console.error(e));

// Log pool errors
pool.on("error", (err) => {
  console.error("Lỗi kết nối database:", err && err.stack ? err.stack : err);
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
    console.error("Query error:", err && err.stack ? err.stack : err);
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
  try {
    pool.end();
  } catch {}
});

// Default export: wrapper exposing query to preserve existing `pool.query(...)` calls
const defaultExport = {
  query: (...args) => query(...args),
};

export { pool, query };
export default defaultExport;
