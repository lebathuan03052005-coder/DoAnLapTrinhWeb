import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;

    res.status(201).json({ image_url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi lưu ảnh vào DB");
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/", bookingRoutes);
app.use("/", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});