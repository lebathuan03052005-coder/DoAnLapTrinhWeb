import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Để false khi chạy local, nếu đẩy lên Azure thì đổi thành true
    trustServerCertificate: true,
  },
  port: parseInt(process.env.DB_PORT),
};

// Biến lưu trữ Pool dùng chung
let poolPromise;

const connectDB = async () => {
  try {
    // Nếu chưa có pool, thì tạo mới
    if (!poolPromise) {
      poolPromise = sql.connect(config);
      await poolPromise; // Đợi kết nối xong để in ra log
      console.log("KẾT NỐI SQL SERVER THÀNH CÔNG!");
    }

    // Trả về pool đã tồn tại
    return await poolPromise;
  } catch (err) {
    console.error("Lỗi kết nối CSDL:", err);
    poolPromise = null; // Reset lại biến nếu kết nối thất bại
    throw err;
  }
};

export { sql, connectDB };
