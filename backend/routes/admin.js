import express from "express";
import sql from "mssql";
import { connectDB } from "../database.js";

const router = express.Router();

// API ĐĂNG NHẬP ADMIN
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập email và mật khẩu!" });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);

    const result = await request.query(`
      SELECT id, full_name, email, role
      FROM Users
      WHERE email = @email AND password_hash = @password AND role = 'admin'
    `);

    if (result.recordset.length > 0) {
      res.json({ success: true, admin: result.recordset[0] });
    } else {
      res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu Admin không đúng!",
      });
    }
  } catch (error) {
    console.error("Lỗi đăng nhập Admin:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

// API QUẢN LÝ TÀI KHOẢN
router.get("/api/accounts", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT id, full_name, email, phone, role
      FROM Users
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy danh sách tài khoản:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi lấy danh sách tài khoản!" });
  }
});

// QUẢN LÝ KHÁCH SẠN (Đã đổi route thành /api/admin/hotels để tránh trùng lặp)
router.get("/api/admin/hotels", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT id, name, location, price
      FROM Hotels
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy danh sách khách sạn:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// Thêm khách sạn
router.post("/api/hotels", async (req, res) => {
  const { name, location, price } = req.body;
  if (!name || !location || !price) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();
    request.input("name", sql.NVarChar, name);
    request.input("location", sql.NVarChar, location);
    request.input("price", sql.Decimal(18, 2), price);

    await request.query(`
      INSERT INTO Hotels (name, location, price)
      VALUES (@name, @location, @price)
    `);
    res.json({ success: true, message: "Thêm khách sạn thành công!" });
  } catch (error) {
    console.error("Lỗi thêm khách sạn:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// Xóa khách sạn
router.delete("/api/hotels/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectDB();
    const request = pool.request();
    request.input("id", sql.Int, id);

    const result = await request.query(`
      DELETE FROM Hotels
      WHERE id = @id
    `);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn!" });
    }
    res.json({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    console.error("Lỗi xóa khách sạn:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// API ĐỔI MẬT KHẨU ADMIN
router.post("/api/change-admin-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  try {
    const pool = await connectDB();
    const request = pool.request();
    request.input("email", sql.VarChar, email);
    request.input("oldPassword", sql.VarChar, oldPassword);

    const check = await request.query(`
      SELECT id
      FROM Users
      WHERE email = @email AND password_hash = @oldPassword AND role = 'admin'
    `);

    if (check.recordset.length > 0) {
      const updateRequest = pool.request();
      updateRequest.input("email", sql.VarChar, email);
      updateRequest.input("newPassword", sql.VarChar, newPassword);

      await updateRequest.query(`
        UPDATE Users
        SET password_hash = @newPassword
        WHERE email = @email AND role = 'admin'
      `);
      res.json({ success: true, message: "Đổi mật khẩu thành công!" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Mật khẩu cũ không chính xác!" });
    }
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

export default router;
