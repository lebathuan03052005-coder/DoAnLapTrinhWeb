import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: "DUCDANG-2005",
  database: "HotelBooking",
  port: 1433,
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

let poolPromise = null;

export const connectDB = async () => {
  try {
    if (!poolPromise) {
      poolPromise = await sql.connect(config);
      console.log("KẾT NỐI SQL SERVER THÀNH CÔNG!");
    }
    return poolPromise;
  } catch (err) {
    console.error("Lỗi kết nối CSDL:", err);
    throw err;
  }
};

export { sql };