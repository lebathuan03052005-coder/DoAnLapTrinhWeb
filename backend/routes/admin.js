import express from "express";
import pool from "../database.js";
// bcrypt removed: passwords will be stored/compared in plaintext per request
import nodemailer from "nodemailer";

const router = express.Router();

// gửi mã xác nhận qua mail.
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = generateOTP();

  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 phút
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "Booking App",
    to: email,
    subject: "Mã xác nhận đăng ký",
    text: `Mã OTP của bạn là: ${otp}`,
  });

  res.json({ success: true, message: "OTP đã gửi" });
});
// kiểm tra và xác nhận thông tin
router.post("/verify-otp-register", async (req, res) => {
  const { email, otp, full_name, phone, password } = req.body;

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ message: "OTP không tồn tại" });
  }

  if (record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "OTP sai hoặc hết hạn" });
  }

  // tạo user (lưu mật khẩu trực tiếp, không mã hóa)
  await pool.query(
    `INSERT INTO users(full_name, email, phone, password_hash, role)
     VALUES ($1,$2,$3,$4,'CUSTOMER')`,
    [full_name, email, phone, password],
  );

  otpStore.delete(email);

  res.json({ success: true, message: "Đăng ký thành công" });
});

//gửi mã xác nhận cho việc quên mật khẩu
router.post("/send-reset-otp", async (req, res) => {
  const { email } = req.body;

  try {
    // check user tồn tại
    const user = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: "Booking App",
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${otp} (hết hạn sau 5 phút)`,
    });

    res.json({ success: true, message: "OTP đã gửi" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// tạo lại mật khẩu
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ message: "OTP không tồn tại" });
    }

    if (record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ message: "OTP sai hoặc hết hạn" });
    }

    // Lưu mật khẩu mới trực tiếp (không mã hóa)
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = $2", [
      newPassword,
      email,
    ]);

    otpStore.delete(email);

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// API ĐĂNG NHẬP ADMIN
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
    if (password !== admin.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu Admin!",
      });
    }

    delete admin.password_hash;
    res.json({ success: true, admin });
  } catch (error) {
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
    // So sánh trực tiếp mật khẩu cũ
    if (oldPassword !== user.password_hash) {
      return res
        .status(401)
        .json({ success: false, message: "Mật khẩu cũ không chính xác!" });
    }

    // Lưu mật khẩu mới trực tiếp (không mã hóa)
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE email = $2 AND role = $3`,
      [newPassword, email, "ADMIN"],
    );
    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

export default router;
