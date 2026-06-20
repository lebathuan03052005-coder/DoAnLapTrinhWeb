import express from "express";
import pool from "../database.js";
import bcrypt from "bcrypt";

// OTP/email functionality removed per request. Registration and password reset
// are handled via direct endpoints below without OTP verification.

const router = express.Router();

// LẤY DANH SÁCH TẤT CẢ KHÁCH SẠN (Public)
router.get("/api/hotels", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hotels");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});

// ROOMS
router.get("/api/rooms", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});

// SEARCH
router.get("/api/search", async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    const params = [];
    let query = `SELECT * FROM hotels WHERE 1=1`;

    if (city) {
      params.push(`%${city}%`);
      query += ` AND city ILIKE $${params.length}`;
    }
    if (minPrice) {
      params.push(minPrice);
      query += ` AND price >= $${params.length}`;
    }
    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND price <= $${params.length}`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Lỗi tìm kiếm");
  }
});

// BOOKING (Cũ)
router.post("/api/bookings", async (req, res) => {
  try {
    const { name, phone, room_id, check_in, check_out } = req.body;
    const bookingRes = await pool.query(
      `INSERT INTO bookings (guest_name, guest_phone, status, created_at) VALUES ($1, $2, 'PENDING', NOW()) RETURNING id`,
      [name, phone],
    );

    const booking_id = bookingRes.rows[0].id;

    await pool.query(
      `INSERT INTO booking_details (booking_id, room_id, check_in_date, check_out_date) VALUES ($1, $2, $3, $4)`,
      [booking_id, room_id, check_in, check_out],
    );

    res.json({ message: "Đặt phòng thành công!" });
  } catch (err) {
    res.status(500).send("Lỗi đặt phòng");
  }
});

// LƯU ĐẶT PHÒNG ĐẦY ĐỦ (ghi đè API cũ)
router.post("/api/bookings/create", async (req, res) => {
  try {
    const {
      hotel_id,
      user_id,
      guest_name,
      guest_phone,
      guest_email,
      room_type_id,
      room_id,
      check_in_date,
      check_out_date,
      total_amount,
      quantity,
    } = req.body;

    const bookingResult = await pool.query(
      `INSERT INTO bookings (hotel_id, user_id, guest_name, guest_phone, guest_email, total_amount, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', NOW()) RETURNING id`,
      [
        hotel_id,
        user_id || null,
        guest_name,
        guest_phone,
        guest_email,
        total_amount,
      ],
    );

    const booking_id = bookingResult.rows[0].id;

    await pool.query(
      `INSERT INTO booking_details (booking_id, room_type_id, room_id, quantity, check_in_date, check_out_date, price_at_booking) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        booking_id,
        room_type_id,
        room_id || null,
        quantity || 1,
        check_in_date,
        check_out_date,
        total_amount,
      ],
    );
    res.json({ success: true, booking_id, message: "Đặt phòng thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi đặt phòng");
  }
});

// Lấy danh sách tất cả đơn đặt phòng (kèm thông tin khách sạn + loại phòng)
router.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.hotel_id,
        h.name AS hotel_name,
        h.image AS hotel_image,
        h.address AS hotel_address,
        b.user_id,
        b.guest_name,
        b.guest_phone,
        b.guest_email,
        b.total_amount,
        b.status,
        b.created_at,
        bd.room_type_id,
        rt.name AS room_type_name,
        bd.quantity,
        bd.check_in_date,
        bd.check_out_date,
        bd.price_at_booking
      FROM bookings b
      LEFT JOIN hotels h ON b.hotel_id = h.id
      LEFT JOIN booking_details bd ON bd.booking_id = b.id
      LEFT JOIN room_types rt ON bd.room_type_id = rt.id
      ORDER BY b.created_at DESC
    `);

    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error("Lỗi lấy danh sách đặt phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// Lấy danh sách đặt phòng CỦA RIÊNG 1 KHÁCH HÀNG đang đăng nhập
// Khớp theo user_id, và fallback theo guest_email cho các booking cũ
// được tạo trước khi có user_id (ví dụ khách đặt phòng lúc chưa đăng nhập)
router.get("/api/bookings/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { email } = req.query; // truyền kèm ?email= để khớp booking cũ

  try {
    const result = await pool.query(
      `
      SELECT 
        b.id,
        b.hotel_id,
        h.name AS hotel_name,
        h.image AS hotel_image,
        h.address AS hotel_address,
        b.user_id,
        b.guest_name,
        b.guest_phone,
        b.guest_email,
        b.total_amount,
        b.status,
        b.created_at,
        bd.room_type_id,
        rt.name AS room_type_name,
        bd.quantity,
        bd.check_in_date,
        bd.check_out_date,
        bd.price_at_booking
      FROM bookings b
      LEFT JOIN hotels h ON b.hotel_id = h.id
      LEFT JOIN booking_details bd ON bd.booking_id = b.id
      LEFT JOIN room_types rt ON bd.room_type_id = rt.id
      WHERE b.user_id = $1 OR ($2::text IS NOT NULL AND b.guest_email = $2)
      ORDER BY b.created_at DESC
      `,
      [userId, email || null],
    );

    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error("Lỗi lấy đặt phòng của khách hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// (Tùy chọn) Cập nhật trạng thái booking — dùng cho nút xác nhận/hủy trên trang admin
router.put("/api/bookings/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // PENDING | CONFIRMED | CANCELLED

  try {
    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id`,
      [status, id],
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn đặt phòng!" });
    }
    res.json({ success: true, message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});
// Lấy danh sách ảnh của một khách sạn cụ thể
router.get("/api/hotels/:hotelId/images", async (req, res) => {
  try {
    const { hotelId } = req.params;
    // Lấy tất cả ảnh có hotel_id khớp với id khách sạn đang chọn
    const result = await pool.query(
      "SELECT * FROM hotel_images WHERE hotel_id = $1",
      [hotelId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy ảnh:", err);
    res.status(500).json({ error: "Không thể lấy ảnh" });
  }
});
// LẤY LOẠI PHÒNG THEO KHÁCH SẠN
router.get("/api/room-types/:hotelId", async (req, res) => {
  try {
    const { hotelId } = req.params;
    const result = await pool.query(
      `SELECT rt.*, (SELECT image_url FROM room_images ri WHERE ri.room_type_id = rt.id LIMIT 1) as image FROM room_types rt WHERE rt.hotel_id = $1 AND rt.is_deleted = false`,
      [hotelId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi lấy loại phòng");
  }
});

// LẤY ẢNH CỦA TỪNG LOẠI PHÒNG
router.get("/api/room-images/:roomTypeId", async (req, res) => {
  try {
    const { roomTypeId } = req.params;
    const result = await pool.query(
      `SELECT * FROM room_images WHERE room_type_id = $1`,
      [roomTypeId],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Lỗi lấy ảnh phòng");
  }
});

router.post("/customer-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, password_hash 
       FROM users 
       WHERE email = $1 AND role = $2`,
      [email, "CUSTOMER"],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    const user = result.rows[0];

    console.log("--- DEBUG ĐĂNG NHẬP ---");
    console.log("Email nhận được:", email);
    console.log("Mật khẩu nhập vào:", password);
    console.log("Password hash trong DB:", user.password_hash);

    const stored = user.password_hash || "";
    let match = false;
    if (stored && stored.startsWith("$2")) {
      match = await bcrypt.compare(password, stored);
    } else {
      match = password === stored;
      if (match) {
        // upgrade plaintext to bcrypt
        try {
          const newHash = await bcrypt.hash(password, 10);
          await pool.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [newHash, user.id],
          );
        } catch (e) {
          console.error("Failed to upgrade user password hash:", e);
        }
      }
    }

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    delete user.password_hash;

    res.json({ success: true, user });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
});

// OTP routes removed. Use /api/register and /api/reset-password below.

// Reset password WITHOUT OTP (per request)
router.post("/api/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ message: "Thiếu trường dữ liệu" });

    const userRes = await pool.query(`SELECT id FROM users WHERE email = $1`, [
      email,
    ]);
    if (userRes.rows.length === 0)
      return res.status(400).json({ message: "Email không tồn tại" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE users SET password_hash = $1 WHERE email = $2`, [
      newHash,
      email,
    ]);
    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API ĐĂNG KÝ TÀI KHOẢN KHÁCH HÀNG
router.post("/api/register", async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    if (!full_name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra email đã tồn tại
    const checkResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    if (checkResult.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã được sử dụng!" });
    }

    // Lưu user mới (lưu mật khẩu trực tiếp, không mã hóa)
    const hash = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, status, created_at) VALUES ($1, $2, $3, $4, 'CUSTOMER', 'ACTIVE', NOW()) RETURNING id`,
      [full_name, email, phone, hash],
    );

    const userId = insertResult.rows[0].id;

    res.json({ success: true, message: "Đăng ký thành công!", userId });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// HOTELS (Sử dụng Postgres syntax)
router.get("/hotels", async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT h.*, 
            COALESCE((SELECT image_url FROM hotel_images hi WHERE hi.hotel_id = h.id LIMIT 1), 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800') AS image
            FROM hotels h
        `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH (Dùng $1, $2 cho Postgres)
router.get("/search", async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    let query = `SELECT * FROM hotels WHERE 1=1`;
    let params = [];
    if (city) {
      query += ` AND city ILIKE $1`;
      params.push(`%${city}%`);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BOOKING (Sử dụng RETURNING id của Postgres)
router.post("/bookings/create", async (req, res) => {
  try {
    const {
      hotel_id,
      user_id,
      guest_name,
      guest_phone,
      guest_email,
      room_type_id,
      total_amount,
      check_in_date,
      check_out_date,
    } = req.body;

    const booking = await pool.query(
      `INSERT INTO Bookings (hotel_id, user_id, guest_name, guest_phone, guest_email, total_amount, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING id`,
      [
        hotel_id,
        user_id || 1,
        guest_name,
        guest_phone,
        guest_email,
        total_amount,
      ],
    );

    const booking_id = booking.rows[0].id;
    await pool.query(
      `INSERT INTO Booking_Details (booking_id, room_type_id, check_in_date, check_out_date) VALUES ($1, $2, $3, $4)`,
      [booking_id, room_type_id, check_in_date, check_out_date],
    );
    res.json({ success: true, booking_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.hotel_id,
        h.name AS hotel_name,
        h.image AS hotel_image,
        h.address AS hotel_address,
        b.user_id,
        b.guest_name,
        b.guest_phone,
        b.guest_email,
        b.total_amount,
        b.status,
        b.created_at,
        bd.room_type_id,
        rt.name AS room_type_name,
        bd.quantity,
        bd.check_in_date,
        bd.check_out_date,
        bd.price_at_booking
      FROM bookings b
      LEFT JOIN hotels h ON b.hotel_id = h.id
      LEFT JOIN booking_details bd ON bd.booking_id = b.id
      LEFT JOIN room_types rt ON bd.room_type_id = rt.id
      ORDER BY b.created_at DESC
    `);

    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error("Lỗi lấy danh sách đặt phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// (Tùy chọn) Cập nhật trạng thái booking — dùng cho nút xác nhận/hủy trên trang admin
router.put("/api/bookings/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // PENDING | CONFIRMED | CANCELLED

  try {
    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id`,
      [status, id],
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn đặt phòng!" });
    }
    res.json({ success: true, message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

export default router;
