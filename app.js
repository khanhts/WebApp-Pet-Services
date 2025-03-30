const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json()); // Hỗ trợ JSON
app.use(cors()); // Cho phép request từ frontend
app.use(express.static(path.join(__dirname, 'public'))); // Phục vụ file tĩnh trong /public

// Kết nối MongoDB
mongoose.connect("mongodb://0.0.0.0:27017/donkham", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log("✅ Kết nối MongoDB thành công!");
});

mongoose.connection.on('error', (err) => {
  console.error("❌ Lỗi kết nối MongoDB:", err);
});

// Import routes
const appointmentsRouter = require('./routes/appointments');
app.use('/appointments', appointmentsRouter);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
