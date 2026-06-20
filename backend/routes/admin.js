import express from "express";
import pool from "../database.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

const router = express.Router();

// API ĐĂNG NHẬP ADMIN - KHÔNG MÃ HÓA
router.post("/api/admin/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, full_name, email, role, password_hash FROM users WHERE email = $1 AND role = $2`,
      [email, "ADMIN"],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tài khoản!" });
    }

    const admin = result.rows[0];
    const stored = admin.password_hash || "";
    let match = false;

    if (stored && stored.startsWith("$2")) {
      match = await bcrypt.compare(password, stored);
    } else {
      // plaintext fallback for existing accounts
      match = password === stored;
      // if plaintext matched, upgrade to bcrypt hash
      if (match) {
        const newHash = await bcrypt.hash(password, 10);
        try {
          await pool.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [newHash, admin.id],
          );
        } catch (e) {
          console.error("Failed to upgrade admin password hash:", e);
        }
      }
    }

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu Admin!",
      });
    }

    delete admin.password_hash;
    res.json({ success: true, admin });
  } catch (error) {
    console.error("Lỗi đăng nhập admin:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
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
// Thêm khách sạn mới
router.post("/api/admin/hotels", async (req, res) => {
  const { name, city, address, description, stars, price, status } = req.body;
  if (!name || !city || !address)
    return res
      .status(400)
      .json({ success: false, message: "Thiếu thông tin bắt buộc!" });
  try {
    const result = await pool.query(
      `INSERT INTO hotels (name, city, address, description, stars, price, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()) RETURNING id`,
      [
        name,
        city,
        address,
        description || "",
        stars || 3,
        price || null,
        status || "pending",
      ],
    );
    res.json({
      success: true,
      message: "Thêm khách sạn thành công!",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Lỗi thêm khách sạn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi Server: " + error.message });
  }
});
// PUT: Cập nhật khách sạn
app.put("/api/admin/hotels/:id", async (req, res) => {
  const { id } = req.params;
  const { name, city, address, description, stars, price, status } = req.body;
  const partnerId = req.headers["x-partner-id"]; // Lấy ID đối tác từ header (hoặc từ JWT token)
  const userRole = req.headers["x-user-role"]; // 'admin' hoặc 'partner'

  try {
    let query = "";
    let params = [];

    if (userRole === "admin") {
      // Admin được sửa tất cả
      query =
        "UPDATE hotels SET name=?, city=?, address=?, description=?, stars=?, price=?, status=? WHERE id=?";
      params = [name, city, address, description, stars, price, status, id];
    } else {
      // Partner chỉ được sửa khách sạn của mình và không được đổi status
      query =
        "UPDATE hotels SET name=?, city=?, address=?, description=?, stars=?, price=? WHERE id=? AND partner_id=?";
      params = [name, city, address, description, stars, price, id, partnerId];
    }

    const result = await db.query(query, params);
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ success: false, message: "Không có quyền sửa khách sạn này!" });
    }
    res.json({ success: true, message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});
// QUẢN LÝ KHÁCH SẠN
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
    const stored = user.password_hash || "";
    let match = false;
    if (stored && stored.startsWith("$2")) {
      match = await bcrypt.compare(oldPassword, stored);
    } else {
      match = oldPassword === stored;
    }

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu cũ không chính xác!" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE email = $2 AND role = $3`,
      [newHash, email, "ADMIN"],
    );
    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});
// Lấy danh sách ảnh của khách sạn
router.get("/api/hotels/:id/images", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, image_url FROM hotel_images WHERE hotel_id = $1 ORDER BY id ASC`,
      [req.params.id],
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Lỗi lấy ảnh khách sạn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi Server: " + error.message });
  }
});
// Xóa 1 ảnh của khách sạn
router.delete("/api/hotels/:id/images/:imageId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM hotel_images WHERE id = $1 AND hotel_id = $2 RETURNING image_url`,
      [req.params.imageId, req.params.id],
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy ảnh!" });
    }
    const filePath = path.join(
      uploadDir,
      path.basename(result.rows[0].image_url),
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ success: true, message: "Xóa ảnh thành công!" });
  } catch (error) {
    console.error("Lỗi xóa ảnh khách sạn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi Server: " + error.message });
  }
});
export default router;
