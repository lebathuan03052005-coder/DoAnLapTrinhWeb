import express from "express";
import pool from "../database.js";
import bcrypt from "bcryptjs";

const router = express.Router();
// API ĐĂNG NHẬP ADMIN
router.post("api/admin/admin-login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Dữ liệu nhận được từ Frontend:", { email, password });
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập email và mật khẩu!" });
  }
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, password_hash FROM users WHERE email = $1 AND role = $2`,
      [email, "ADMIN"],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu Admin không đúng!",
      });
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu Admin không đúng!",
      });
    }

    delete admin.password_hash;
    res.json({ success: true, admin });
  } catch (error) {
    console.error("Lỗi đăng nhập Admin:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

// API QUẢN LÝ TÀI KHOẢN
router.get("/api/accounts", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, role FROM users`,
    );
    res.json(result.rows);
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
    const result = await pool.query(
      `SELECT id, name, city, status, description, address FROM hotels`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Lỗi lấy danh sách khách sạn:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

router.get("/api/admin/hotels/:id/rooms", async (req, res) => {
  try {
    const hotelId = req.params.id;

    const result = await pool.query(
      `SELECT * FROM room_types WHERE hotel_id = $1`,
      [hotelId],
    );
    const rows = result.rows;

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "Khách sạn này hiện chưa có phòng nào.",
      });
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("LỖI SQL CHI TIẾT:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi Server: " + error.message,
    });
  }
});
// Xóa khách sạn
router.delete("/api/admin/hotels/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM hotels WHERE id = $1 RETURNING id`,
      [id],
    );
    if (result.rowCount === 0) {
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
// Duyệt khách sạn
router.put("/api/admin/hotels/:id/approved", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE hotels SET status = 'approved' WHERE id = $1 RETURNING id`,
      [id],
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn!" });
    }
    res.json({ success: true, message: "Duyệt khách sạn thành công!" });
  } catch (error) {
    console.error("Lỗi duyệt khách sạn:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});
// Cấm khách sạn
router.put("/api/admin/hotels/:id/banned", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE hotels SET status = 'banned' WHERE id = $1 RETURNING id`,
      [id],
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy khách sạn!" });
    }
    res.json({ success: true, message: "Cấm khách sạn thành công!" });
  } catch (error) {
    console.error("Lỗi cấm khách sạn:", error);
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
    const check = await pool.query(
      `SELECT id, password_hash FROM users WHERE email = $1 AND role = $2`,
      [email, "ADMIN"],
    );

    if (check.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu cũ không chính xác!" });
    }

    const user = check.rows[0];
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu cũ không chính xác!" });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE email = $2 AND role = $3`,
      [hashedNew, email, "ADMIN"],
    );
    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

export default router;
