const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Appointment = require('../models/Appointment');

// ✅ API lấy danh sách lịch hẹn
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Thêm lịch hẹn mới
router.post('/add', async (req, res) => {
  try {
      const { pet, ownerName, phone, email, appointmentDate, reason } = req.body;

      // 🔍 Chuyển đổi `appointmentDate` về dạng YYYY-MM-DD để tránh sai múi giờ
      const dateOnly = new Date(appointmentDate);
      dateOnly.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00

      // ✅ Kiểm tra số lượng lịch hẹn đã đặt trong ngày
      const countAppointments = await Appointment.countDocuments({
          appointmentDate: {
              $gte: dateOnly, // Bắt đầu từ 00:00:00
              $lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000) // Trước 23:59:59
          }
      });

      if (countAppointments >= 5) {
          return res.status(400).json({ message: "❌ Ngày này đã đủ 5 lịch hẹn, vui lòng chọn ngày khác!" });
      }

      // 🟢 Nếu chưa đủ 5, tạo lịch hẹn mới
      const newAppointment = new Appointment({
          pet,
          ownerName,
          phone,
          email,
          appointmentDate: dateOnly, // Lưu dưới dạng ngày chuẩn
          reason
      });

      await newAppointment.save();

      // ✅ Chuyển hướng đến trang thành công
      res.redirect(`/appointments/success/${newAppointment._id}`);

  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});


// ✅ Hiển thị trang thành công sau khi đặt lịch
router.get('/success/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).send("Lịch hẹn không tồn tại!");

        res.render('success', { appointment });
    } catch (error) {
        res.status(500).send("Lỗi server!");
    }
});

// ✅ Xóa lịch hẹn
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) return res.status(404).json({ message: "Lịch hẹn không tồn tại!" });
        res.json({ message: "Lịch hẹn đã bị xóa!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
