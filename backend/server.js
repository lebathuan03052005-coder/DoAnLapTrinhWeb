import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

app.use("/", bookingRoutes);
app.use("/", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});