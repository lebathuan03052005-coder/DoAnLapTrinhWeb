import express from "express";
import pool from "../database.js";
import bcrypt from "bcryptjs";

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

// API ĐĂNG NHẬP KHÁCH
router.post("/customer-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, password_hash FROM users WHERE email = $1 AND role = $2`,
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
    console.log("Mật khẩu nhập vào (plaintext):", password);
    console.log("Password hash lấy từ DB:", admin.password_hash);

    const match = await bcrypt.compare(password, admin.password_hash);
    console.log("Kết quả so sánh (match):", match);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
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

    // Mã hóa mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Lưu user mới
    const insertResult = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, status, created_at) VALUES ($1, $2, $3, $4, 'CUSTOMER', 'ACTIVE', NOW()) RETURNING id`,
      [full_name, email, phone, hashedPassword],
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
            FROM Hotels h
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

export default router;
