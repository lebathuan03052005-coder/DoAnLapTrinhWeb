import express from "express";
import sql from "mssql";
import { connectDB } from "../database.js";
import bcrypt from "bcrypt";

const router = express.Router();

// =========================================================================
// API ĐĂNG NHẬP & ĐỔI MẬT KHẨU ADMIN
// =========================================================================

router.post("/api/admin-login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Vui lòng nhập email và mật khẩu!" });

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .query(`SELECT id, full_name, email, role, password_hash
              FROM Users WHERE email = @email AND role = 'ADMIN'`);

    if (!result.recordset.length)
      return res.status(401).json({ success: false, message: "Tài khoản hoặc mật khẩu Admin không đúng!" });

    const admin = result.recordset[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Tài khoản hoặc mật khẩu Admin không đúng!" });

    delete admin.password_hash;
    res.json({ success: true, admin });
  } catch (error) {
    console.error("Lỗi đăng nhập Admin:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

router.post("/api/change-admin-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword)
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });

  try {
    const pool = await connectDB();
    const check = await pool.request()
      .input("email", sql.NVarChar, email)
      .query(`SELECT id, password_hash FROM Users WHERE email = @email AND role = 'ADMIN'`);

    if (!check.recordset.length)
      return res.status(401).json({ success: false, message: "Mật khẩu cũ không chính xác!" });

    const admin = check.recordset[0];
    const isMatch = await bcrypt.compare(oldPassword, admin.password_hash);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Mật khẩu cũ không chính xác!" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input("email", sql.NVarChar, email)
      .input("newPassword", sql.NVarChar, hashed)
      .query(`UPDATE Users SET password_hash = @newPassword, updated_at = GETDATE()
              WHERE email = @email AND role = 'ADMIN'`);

    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối Server!" });
  }
});

// =========================================================================
// ACCOUNTS & HOTELS
// =========================================================================

router.get("/api/accounts", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .query(`SELECT id, full_name, email, phone, role, status FROM Users`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy danh sách tài khoản:", error);
    res.status(500).json({ success: false, message: "Lỗi Hệ thống!" });
  }
});

router.get("/api/admin/hotels", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .query(`SELECT id, name, city, address, description, status FROM Hotels`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy danh sách khách sạn:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// =========================================================================
// ROOM TYPES
// =========================================================================

// GET tất cả loại phòng
router.get("/api/admin/room-types", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT id, hotel_id, name,
             base_price    AS price,
             capacity,
             bed_type      AS bedType,
             view_type     AS viewType,
             has_bathtub   AS hasBathtub,
             amenities,
             description,
             is_deleted    AS isDeleted
      FROM Room_Types
      WHERE is_deleted = 0
      ORDER BY id
    `);
    const records = result.recordset.map(row => ({
      ...row,
      amenities: row.amenities ? row.amenities.split(",").map(a => a.trim()) : []
    }));
    res.json(records);
  } catch (error) {
    console.error("Lỗi lấy loại phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// POST thêm hoặc cập nhật loại phòng
router.post("/api/admin/room-types", async (req, res) => {
  const { id, name, price, capacity, bedType, viewType, hasBathtub, amenities, description } = req.body;
  const amenitiesStr = Array.isArray(amenities) ? amenities.join(",") : (amenities || "");

  try {
    const pool = await connectDB();

    if (id) {
      // CẬP NHẬT
      await pool.request()
        .input("id",          sql.Int,       id)
        .input("name",        sql.NVarChar,  name)
        .input("price",       sql.Decimal,   price)
        .input("capacity",    sql.Int,        capacity)
        .input("bedType",     sql.NVarChar,  bedType || null)
        .input("viewType",    sql.NVarChar,  viewType || null)
        .input("hasBathtub",  sql.Bit,       hasBathtub ? 1 : 0)
        .input("amenities",   sql.NVarChar,  amenitiesStr)
        .input("description", sql.NVarChar,  description || null)
        .query(`UPDATE Room_Types
                SET name = @name, base_price = @price, capacity = @capacity,
                    bed_type = @bedType, view_type = @viewType, has_bathtub = @hasBathtub,
                    amenities = @amenities, description = @description, updated_at = GETDATE()
                WHERE id = @id`);
      res.json({ success: true, message: "Cập nhật loại phòng thành công!" });
    } else {
      // THÊM MỚI — FIX: id không phải IDENTITY nên phải tự tính
      const idRes = await pool.request()
        .query(`SELECT ISNULL(MAX(id), 0) + 1 AS newId FROM Room_Types`);
      const newId = idRes.recordset[0].newId;

      await pool.request()
        .input("newId",       sql.Int,       newId)
        .input("name",        sql.NVarChar,  name)
        .input("price",       sql.Decimal,   price)
        .input("capacity",    sql.Int,        capacity)
        .input("bedType",     sql.NVarChar,  bedType || null)
        .input("viewType",    sql.NVarChar,  viewType || null)
        .input("hasBathtub",  sql.Bit,       hasBathtub ? 1 : 0)
        .input("amenities",   sql.NVarChar,  amenitiesStr)
        .input("description", sql.NVarChar,  description || null)
        .query(`INSERT INTO Room_Types
                  (id, hotel_id, name, base_price, capacity, bed_type, view_type, has_bathtub, amenities, description, is_deleted, created_at)
                VALUES
                  (@newId, 1, @name, @price, @capacity, @bedType, @viewType, @hasBathtub, @amenities, @description, 0, GETDATE())`);
      res.json({ success: true, message: "Thêm loại phòng thành công!" });
    }
  } catch (error) {
    console.error("Lỗi lưu loại phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// DELETE loại phòng (soft delete)
router.delete("/api/admin/room-types/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectDB();

    const check = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT COUNT(*) AS cnt FROM Rooms WHERE room_type_id = @id AND is_deleted = 0`);
    if (check.recordset[0].cnt > 0)
      return res.status(400).json({ success: false, message: "Loại phòng đang chứa phòng thực tế, không thể xoá!" });

    await pool.request()
      .input("id", sql.Int, id)
      .query(`UPDATE Room_Types SET is_deleted = 1, updated_at = GETDATE() WHERE id = @id`);
    res.json({ success: true, message: "Xoá loại phòng thành công!" });
  } catch (error) {
    console.error("Lỗi xoá loại phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// =========================================================================
// ROOMS
// =========================================================================

// GET tất cả phòng vật lý
router.get("/api/admin/rooms", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT r.id,
             r.room_number  AS number,
             r.room_type_id AS typeId,
             rt.name        AS typeName,
             rt.base_price  AS price,
             r.status
      FROM Rooms r
      LEFT JOIN Room_Types rt ON r.room_type_id = rt.id
      WHERE r.is_deleted = 0
      ORDER BY r.room_number
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy danh sách phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// POST thêm phòng mới
router.post("/api/admin/rooms", async (req, res) => {
  const { number, typeId } = req.body;
  if (!number || !typeId)
    return res.status(400).json({ success: false, message: "Thiếu số phòng hoặc loại phòng!" });

  try {
    const pool = await connectDB();

    // Kiểm tra số phòng đã tồn tại chưa
    const dup = await pool.request()
      .input("number", sql.NVarChar, number)
      .query(`SELECT id FROM Rooms WHERE room_number = @number AND is_deleted = 0`);
    if (dup.recordset.length > 0)
      return res.status(400).json({ success: false, message: `Số phòng ${number} đã tồn tại!` });

    await pool.request()
      .input("number", sql.NVarChar, number)
      .input("typeId", sql.Int,      typeId)
      .query(`INSERT INTO Rooms (room_type_id, room_number, status, is_deleted)
              VALUES (@typeId, @number, 'available', 0)`);
    res.json({ success: true, message: "Thêm phòng thành công!" });
  } catch (error) {
    console.error("Lỗi thêm phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// DELETE phòng vật lý (soft delete)
router.delete("/api/admin/rooms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await connectDB();
    const check = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT status FROM Rooms WHERE id = @id AND is_deleted = 0`);

    if (!check.recordset.length)
      return res.status(404).json({ success: false, message: "Không tìm thấy phòng!" });
    if (check.recordset[0].status === 'occupied')
      return res.status(400).json({ success: false, message: "Phòng đang có khách, không thể xoá!" });

    await pool.request()
      .input("id", sql.Int, id)
      .query(`UPDATE Rooms SET is_deleted = 1 WHERE id = @id`);
    res.json({ success: true, message: "Xoá phòng thành công!" });
  } catch (error) {
    console.error("Lỗi xoá phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// =========================================================================
// BOOKINGS
// =========================================================================

// GET tất cả đơn đặt phòng — JOIN đầy đủ Hotels, Users, Booking_Details, Room_Types
router.get("/api/admin/bookings", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT
        b.id,
        b.guest_name             AS guestName,
        b.guest_phone            AS phone,
        b.guest_email            AS email,
        b.status,
        b.total_amount           AS total,
        b.created_at             AS createdAt,
        h.name                   AS hotelName,
        u.full_name              AS userName,
        -- Lấy thông tin chi tiết từ Booking_Details (dòng đầu tiên)
        (SELECT TOP 1 bd.check_in_date
         FROM Booking_Details bd WHERE bd.booking_id = b.id)            AS checkIn,
        (SELECT TOP 1 bd.check_out_date
         FROM Booking_Details bd WHERE bd.booking_id = b.id)            AS checkOut,
        (SELECT TOP 1 rt.name
         FROM Booking_Details bd
         LEFT JOIN Room_Types rt ON bd.room_type_id = rt.id
         WHERE bd.booking_id = b.id)                                    AS roomType,
        (SELECT TOP 1 bd.room_id
         FROM Booking_Details bd WHERE bd.booking_id = b.id)            AS roomId,
        (SELECT TOP 1 DATEDIFF(day, bd.check_in_date, bd.check_out_date)
         FROM Booking_Details bd WHERE bd.booking_id = b.id)            AS nights,
        (SELECT TOP 1 bd.price_at_booking
         FROM Booking_Details bd WHERE bd.booking_id = b.id)            AS priceAtBooking
      FROM Bookings b
      LEFT JOIN Hotels h ON b.hotel_id = h.id
      LEFT JOIN Users  u ON b.user_id  = u.id
      ORDER BY b.created_at DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy danh sách đặt phòng:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

// PUT cập nhật trạng thái đơn đặt
router.put("/api/admin/bookings/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ!" });

  try {
    const pool = await connectDB();
    await pool.request()
      .input("id",     sql.Int,      id)
      .input("status", sql.NVarChar, status)
      .query(`UPDATE Bookings SET status = @status, updated_at = GETDATE() WHERE id = @id`);
    res.json({ success: true, message: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ success: false, message: "Lỗi Server!" });
  }
});

export default router;
