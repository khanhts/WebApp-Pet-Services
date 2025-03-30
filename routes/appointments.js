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
            return res.status(400).json({ message: `❌ Khung giờ ${selectedHour} đã được đặt, vui lòng chọn giờ khác!` });
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

// ✅ API cập nhật trạng thái đơn hẹn
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ["Đang xử lý", "Đã xác nhận", "Đã hủy"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "❌ Trạng thái không hợp lệ!" });
        }

        // Cập nhật trạng thái lịch hẹn
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Trả về dữ liệu sau khi cập nhật
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "❌ Lịch hẹn không tồn tại!" });
        }

        res.json({ message: "✔ Trạng thái đã được cập nhật!", appointment: updatedAppointment });
    } catch (error) {
        console.error("❌ Lỗi cập nhật trạng thái:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

async function updateStatus(id, newStatus) {
    if (!confirm(`Bạn có chắc chắn muốn cập nhật trạng thái thành "${newStatus}" không?`)) {
        return; // Nếu người dùng hủy, dừng lại
    }

    const selectElement = document.querySelector(`select[data-id='${id}']`);
    if (selectElement) {
        selectElement.disabled = true; // Tạm thời vô hiệu hóa dropdown
    }

    try {
        const response = await fetch(`/appointments/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Lỗi không xác định");
        }

        alert("✔ Trạng thái đã được cập nhật!");
        fetchAppointments(); // Làm mới danh sách
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật trạng thái:", error);
        alert(`⚠ Không thể cập nhật trạng thái: ${error.message}`);
    } finally {
        if (selectElement) {
            selectElement.disabled = false; // Kích hoạt lại dropdown sau khi hoàn thành
        }
    }
}

module.exports = router;
s