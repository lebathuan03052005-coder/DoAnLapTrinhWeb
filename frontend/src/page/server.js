import express from 'express';
import cors from 'cors';
import { connectDB } from './database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const app = express();
app.use(cors());
app.use(express.json());
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);
console.log(path.join(__dirname, '../uploads'));
// Cấu hình upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Cho phép truy cập thư mục uploads
app.use('/uploads', express.static('uploads'));

// API upload ảnh
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Không có file' });
  res.json({ 
    success: true,
    url: `http://localhost:5000/uploads/${req.file.filename}` 
  });
});

const PORT = 5000;

// TEST
app.get('/', (req, res) => {
    res.send('SERVER OK 🚀');
});

// HOTELS
app.get('/api/hotels', async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT
        h.id,
        h.name,
        h.stars,
        h.price,
        h.discount,
        h.address,
        h.city,
        h.rating,
        h.description,
        COALESCE(
          (SELECT TOP 1 image_url FROM hotel_images hi WHERE hi.hotel_id = h.id ORDER BY hi.id ASC),
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
        ) AS image
      FROM Hotels h
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// ROOMS
app.get('/api/rooms', async (req, res) => {
    try {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM rooms');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Lỗi server');
    }
});

// SEARCH
app.get('/api/search', async (req, res) => {
    try {
        const { city, minPrice, maxPrice } = req.query;

        const pool = await connectDB();
        let request = pool.request();
        let query = `SELECT * FROM hotels WHERE 1=1`;

        if (city) {
            query += ` AND city LIKE @city`;
            request.input('city', `%${city}%`);
        }

        if (minPrice) {
            query += ` AND price >= @minPrice`;
            request.input('minPrice', minPrice);
        }

        if (maxPrice) {
            query += ` AND price <= @maxPrice`;
            request.input('maxPrice', maxPrice);
        }

        const result = await request.query(query);
        res.json(result.recordset);

    } catch (err) {
        res.status(500).send('Lỗi tìm kiếm');
    }
});

// BOOKING
app.post('/api/bookings', async (req, res) => {
    try {
        const { name, phone, room_id, check_in, check_out } = req.body;

        const pool = await connectDB();

        const result = await pool.request()
            .input('name', name)
            .input('phone', phone)
            .input('check_in', check_in)
            .input('check_out', check_out)
            .query(`
                INSERT INTO bookings (customer_name, phone, check_in, check_out, status)
                OUTPUT INSERTED.id
                VALUES (@name, @phone, @check_in, @check_out, 'pending')
            `);

        const booking_id = result.recordset[0].id;

        await pool.request()
            .input('booking_id', booking_id)
            .input('room_id', room_id)
            .query(`
                INSERT INTO booking_details (booking_id, room_id)
                VALUES (@booking_id, @room_id)
            `);

        res.json({ message: "Đặt phòng thành công!" });

    } catch (err) {
        res.status(500).send("Lỗi đặt phòng");
    }
});
// LẤY LOẠI PHÒNG THEO KHÁCH SẠN
app.get('/api/room-types/:hotelId', async (req, res) => {
    try {
        const { hotelId } = req.params;
        const pool = await connectDB();
        
        console.log("🔍 Fetching rooms for hotelId:", hotelId);
        
        const result = await pool.request()
            .input('hotelId', hotelId)
            .query(`
                SELECT rt.*, 
                       (SELECT TOP 1 image_url FROM Room_Images ri 
                        WHERE ri.room_type_id = rt.id) as image
                FROM Room_Types rt
                WHERE rt.hotel_id = @hotelId 
                AND (rt.is_deleted IS NULL OR rt.is_deleted = 0)
                ORDER BY rt.id
`);
        
        console.log("✅ Rooms found:", result.recordset.length);
        
        res.json(result.recordset);
    } catch (err) {
        console.error("❌ Error fetching room types:", err);
        res.status(500).json({ error: 'Lỗi lấy loại phòng', details: err.message });
    }
});
// LẤY ẢNH CỦA TỪNG LOẠI PHÒNG
app.get('/api/room-images/:roomTypeId', async (req, res) => {
    try {
        const { roomTypeId } = req.params;
        const pool = await connectDB();
        const result = await pool.request()
            .input('roomTypeId', roomTypeId)
            .query(`SELECT * FROM Room_Images WHERE room_type_id = @roomTypeId`);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Lỗi lấy ảnh phòng');
    }
});

// LƯU ĐẶT PHÒNG ĐẦY ĐỦ (ghi đè API cũ)
app.post('/api/bookings/create', async (req, res) => {
  try {
    const { 
      hotel_id, user_id, guest_name, guest_phone, guest_email,
      room_type_id, room_id, check_in_date, check_out_date, 
      total_amount
    } = req.body;

    // ← THÊM HÀM NÀY để convert ngày
    const convertDate = (dateStr) => {
      if (!dateStr) return null;
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
      }
      return dateStr;
    };

    const checkInFormatted = convertDate(check_in_date);
    const checkOutFormatted = convertDate(check_out_date);
    console.log("📅 Ngày sau convert:", checkInFormatted, checkOutFormatted); // ← THÊM DÒNG NÀY

    const pool = await connectDB();

    const bookingResult = await pool.request()
      .input('hotel_id', hotel_id)
      .input('user_id', user_id || 1)
      .input('guest_name', guest_name)
      .input('guest_phone', guest_phone)
      .input('guest_email', guest_email)
      .input('total_amount', total_amount)
      .query(`
        INSERT INTO Bookings (hotel_id, user_id, guest_name, guest_phone, guest_email, total_amount, status)
        OUTPUT INSERTED.id
        VALUES (@hotel_id, @user_id, @guest_name, @guest_phone, @guest_email, @total_amount, 'pending')
      `);

    const booking_id = bookingResult.recordset[0].id;

    await pool.request()
      .input('booking_id', booking_id)
      .input('room_type_id', room_type_id)
      .input('room_id', room_id || null)
      .input('check_in_date', checkInFormatted)   // ← dùng ngày đã convert
      .input('check_out_date', checkOutFormatted)  // ← dùng ngày đã convert
      .query(`
        INSERT INTO Booking_Details (booking_id, room_type_id, room_id, check_in_date, check_out_date)
        VALUES (@booking_id, @room_type_id, @room_id, @check_in_date, @check_out_date)
      `);

    res.json({ success: true, booking_id, message: "Đặt phòng thành công!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// LẤY ẢNH THEO HOTEL ID
app.get('/api/hotels/:id/images', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT id, hotel_id, image_url 
        FROM hotel_images 
        WHERE hotel_id = @id 
        ORDER BY id ASC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi lấy ảnh khách sạn:", err);
    res.status(500).json({ error: err.message });
  }
});
// LẤY DANH SÁCH ĐẶT PHÒNG THEO USER
app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = await connectDB();
    const result = await pool.request()
      .input('userId', userId)
      .query(`
        SELECT 
          b.id, b.hotel_id, b.guest_name, b.guest_phone, b.guest_email,
          b.total_amount, b.status, b.created_at,
          h.name as hotel_name, h.address as hotel_address, h.image as hotel_image,
          bd.check_in_date, bd.check_out_date,
          rt.name as room_name
        FROM Bookings b
        JOIN Hotels h ON b.hotel_id = h.id
        JOIN Booking_Details bd ON bd.booking_id = b.id
        JOIN Room_Types rt ON bd.room_type_id = rt.id
        WHERE b.user_id = @userId
        ORDER BY b.created_at DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// START SERVER
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
