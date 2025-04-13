const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Appointment = require('./models/Appointment');
const appointments = require('./routes/appointments');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/appointments', appointments);
app.use(express.static(path.join(__dirname, 'public'))); // Chứa HTML, CSS, JS

// ✅ Kết nối MongoDB (Xử lý lỗi tốt hơn)
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://0.0.0.0:27017/donkham", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB connected!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
}
connectDB();

// 📌 API cho FullCalendar
app.use('/appointments', require('./routes/appointments'));

// 📌 Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("❌ Lỗi server:", err);
  res.status(500).json({ message: "Có lỗi xảy ra trên server!" });
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
