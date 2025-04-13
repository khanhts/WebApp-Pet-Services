const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require('../schemas/Appointment');

// Endpoint: Lấy danh sách các đơn hẹn khám
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint: Lấy chi tiết đơn hẹn khám theo id
router.get('/my/:id', getAppointment, (req, res) => {
  res.json(res.appointment);
});

// Endpoint: Tạo đơn hẹn khám mới
router.post('/', async (req, res) => {
  const { code, registerDate, status } = req.body;
  const appointment = new Appointment({
    code,
    registerDate,
    status,
  });
  try {
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint: Hủy đơn hẹn khám (thay đổi trạng thái sang "Đã hủy")
router.delete('/:id/cancel', getAppointment, async (req, res) => {
  try {
    res.appointment.status = 'Đã hủy';
    await res.appointment.save();
    res.json({ message: 'Đơn hủy thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware: Tìm đơn hẹn khám theo id
async function getAppointment(req, res, next) {
  let appointment;
  try {
    appointment = await Appointment.findById(req.params.id);
    if (appointment == null) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hẹn khám' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.appointment = appointment;
  next();
}
// ✅ Thêm lịch hẹn mới
router.post('/add', async (req, res) => {
    try {
        const { pet, ownerName, phone, email, appointmentDate, reason } = req.body;

        const selectedDate = new Date(appointmentDate);
        const selectedHour = selectedDate.toISOString().slice(11, 16); // Lấy giờ HH:MM

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Kiểm tra số lượng lịch hẹn đã đặt trong ngày
        const countAppointments = await Appointment.countDocuments({
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        });

        if (countAppointments >= 5) {
            return res.status(400).json({ message: "❌ Ngày này đã đủ 5 lịch hẹn, vui lòng chọn ngày khác!" });
        }

        // Kiểm tra nếu giờ đã có người đặt
        const existingAppointment = await Appointment.findOne({
            appointmentDate: new Date(appointmentDate)
        });

        if (existingAppointment) {
            return res.status(400).json({ message: ❌ Khung giờ ${selectedHour} đã được đặt, vui lòng chọn giờ khác! });
        }

        const newAppointment = new Appointment({ pet, ownerName, phone, email, appointmentDate, reason });
        await newAppointment.save();

        res.json({ message: "✅ Đặt lịch thành công!", appointment: newAppointment });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// ✅ API lấy danh sách giờ đã đặt trong ngày
router.get('/booked-hours', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: "Thiếu ngày!" });

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        });

        const bookedHours = appointments.map(appt => appt.appointmentDate.toISOString().slice(11, 16));

        res.json(bookedHours);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách giờ đặt!", error });
    }
});
// ✅ API lấy danh sách ngày đã đủ 5 lịch hẹn
router.get('/disabled-dates', async (req, res) => {
    try {
        const appointments = await Appointment.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
                    count: { $sum: 1 }
                }
            },
            { $match: { count: { $gte: 5 } } } // Chỉ lấy ngày có >= 5 lịch hẹn
        ]);

        const disabledDates = appointments.map(appt => appt._id);
        res.json(disabledDates);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách ngày đã đủ lịch!", error });
    }
});

// ✅ API lấy thông tin lịch hẹn theo ID
router.get('/:id', async (req, res) => {
  try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) return res.status(404).json({ message: "Lịch hẹn không tồn tại!" });

      res.json(appointment); // Gửi dữ liệu JSON về client
  } catch (error) { 
      console.error("❌ Lỗi server:", error);
      res.status(500).json({ message: "Lỗi server!" });
  }
});

// ✅ Hiển thị trang thành công sau khi đặt lịch
router.get('/success/:id', async (req, res) => {
  try {
      console.log("✅ Nhận yêu cầu đến success/:id với ID:", req.params.id);

      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
          console.error("❌ Không tìm thấy lịch hẹn!");
          return res.status(404).json({ message: "Lịch hẹn không tồn tại!" });
      }

      // ✅ Kiểm tra đường dẫn file HTML
      const filePath = path.join(__dirname, '../public/success.html');
      console.log("✅ Đường dẫn success.html:", filePath);

      res.sendFile(filePath);
  } catch (error) {
      console.error("❌ Lỗi server:", error);
      res.status(500).json({ message: "Lỗi server!", error: error.message });
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

