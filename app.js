const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Chứa HTML, CSS, JS

// ✅ Kết nối MongoDB (Xử lý lỗi tốt hơn)
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://0.0.0.0:27017/PetClinic", {
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

// 📌 Trang chủ (Hiển thị lịch)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calendar.html'));
});

// 📌 Lấy danh sách lịch hẹn (Dùng cho API JSON)
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 Thêm lịch hẹn mới
app.post('/appointments/add', async (req, res) => {
  try {
    const { pet, ownerName, phone, email, appointmentDate, reason } = req.body;
    const newAppointment = new Appointment({ pet, ownerName, phone, email, appointmentDate, reason });
    await newAppointment.save();
    res.json({ message: "✅ Đặt lịch thành công!", appointment: newAppointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📌 Cập nhật lịch hẹn
app.put('/appointments/update/:id', async (req, res) => {
  try {
    const { appointmentDate, examDate, reason } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { appointmentDate, examDate, reason },
      { new: true }
    );
    if (!updatedAppointment) return res.status(404).json({ message: "❌ Không tìm thấy lịch hẹn!" });

    res.json({ message: "✅ Cập nhật lịch hẹn thành công!", appointment: updatedAppointment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/appointments/add-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/add-form.html'));
});


// 📌 Xóa lịch hẹn
app.delete('/appointments/delete/:id', async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) return res.status(404).json({ message: "❌ Không tìm thấy lịch hẹn!" });

    res.json({ message: "✅ Lịch hẹn đã bị xóa!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
