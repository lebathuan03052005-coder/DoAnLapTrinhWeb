import express from "express";
import sql from "mssql";
import { connectDB } from "../database.js";

const router = express.Router();

// LẤY DANH SÁCH TẤT CẢ KHÁCH SẠN (Public)
router.get("/api/hotels", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM hotels");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});

// ROOMS
router.get("/api/rooms", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM rooms");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});

// SEARCH
router.get("/api/search", async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    const pool = await connectDB();
    let request = pool.request();
    let query = `SELECT * FROM hotels WHERE 1=1`;

    if (city) {
      query += ` AND city LIKE @city`;
      request.input("city", `%${city}%`);
    }
    if (minPrice) {
      query += ` AND price >= @minPrice`;
      request.input("minPrice", minPrice);
    }
    if (maxPrice) {
      query += ` AND price <= @maxPrice`;
      request.input("maxPrice", maxPrice);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Lỗi tìm kiếm");
  }
});

// BOOKING (Cũ)
router.post("/api/bookings", async (req, res) => {
  try {
    const { name, phone, room_id, check_in, check_out } = req.body;
    const pool = await connectDB();

    const result = await pool
      .request()
      .input("name", name)
      .input("phone", phone)
      .input("check_in", check_in)
      .input("check_out", check_out).query(`
                INSERT INTO bookings (customer_name, phone, check_in, check_out, status)
                OUTPUT INSERTED.id
                VALUES (@name, @phone, @check_in, @check_out, 'pending')
            `);

    const booking_id = result.recordset[0].id;

    await pool
      .request()
      .input("booking_id", booking_id)
      .input("room_id", room_id).query(`
                INSERT INTO booking_details (booking_id, room_id)
                VALUES (@booking_id, @room_id)
            `);

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

    const pool = await connectDB();

    const bookingResult = await pool
      .request()
      .input("hotel_id", hotel_id)
      .input("user_id", user_id || null)
      .input("guest_name", guest_name)
      .input("guest_phone", guest_phone)
      .input("guest_email", guest_email)
      .input("total_amount", total_amount).query(`
                INSERT INTO Bookings (hotel_id, user_id, guest_name, guest_phone, guest_email, total_amount, status)
                OUTPUT INSERTED.id
                VALUES (@hotel_id, @user_id, @guest_name, @guest_phone, @guest_email, @total_amount, 'pending')
            `);

    const booking_id = bookingResult.recordset[0].id;

    await pool
      .request()
      .input("booking_id", booking_id)
      .input("room_type_id", room_type_id)
      .input("room_id", room_id || null)
      .input("quantity", quantity || 1)
      .input("check_in_date", check_in_date)
      .input("check_out_date", check_out_date)
      .input("total_amount", total_amount).query(`
        INSERT INTO Booking_Details (booking_id, room_type_id, room_id, quantity, check_in_date, check_out_date, price_at_booking)
        VALUES (@booking_id, @room_type_id, @room_id, @quantity, @check_in_date, @check_out_date, @total_amount)
    `);
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
    const pool = await connectDB();
    const result = await pool.request().input("hotelId", hotelId).query(`
                SELECT rt.*, 
                       (SELECT TOP 1 image_url FROM Room_Images ri 
                        WHERE ri.room_type_id = rt.id) as image
                FROM Room_Types rt
                WHERE rt.hotel_id = @hotelId 
                AND rt.is_deleted = 0
                AND rt.id IN (
                    SELECT MIN(id) FROM Room_Types GROUP BY hotel_id, name, base_price
                )
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi lấy loại phòng");
  }
});

// LẤY ẢNH CỦA TỪNG LOẠI PHÒNG
router.get("/api/room-images/:roomTypeId", async (req, res) => {
  try {
    const { roomTypeId } = req.params;
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("roomTypeId", roomTypeId)
      .query(`SELECT * FROM Room_Images WHERE room_type_id = @roomTypeId`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Lỗi lấy ảnh phòng");
  }
});

// API ĐĂNG NHẬP KHÁCH
router.post("/customer-login", async (req, res) => {
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
      WHERE email = @email AND password_hash = @password AND role = 'customer'
    `);

    if (result.recordset.length > 0) {
      res.json({ success: true, customer: result.recordset[0] });
    } else {
      res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác!",
      });
    }
  } catch (error) {
    console.error("Lỗi đăng nhập Customer:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

export default router;
