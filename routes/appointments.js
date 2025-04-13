const express = require('express');

const mongoose = require('mongoose');
const router = express.Router();
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const Appointment = require('../schemas/Appointment');
const appointmentController = require('../controllers/appointmentController');

// ✅ API lấy danh sách lịch hẹn
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



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

// ✅ API: Lấy tất cả lịch hẹn
router.get('/', async (req, res) => {
    try {
        const appointments = await appointmentController.GetAllAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ API: Lấy lịch hẹn theo ID
router.get('/:id', async (req, res) => {
    try {
        const appointment = await appointmentController.GetAppointmentByID(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Lịch hẹn không tồn tại!" });
        res.json(appointment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


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


        const bookedHours = await appointmentController.GetBookedHoursByDate(date);

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

// ✅ API: Lấy danh sách ngày đã đủ 5 lịch hẹn

router.get('/disabled-dates', async (req, res) => {
    try {
        const disabledDates = await appointmentController.GetFullyBookedDates();

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

// ✅ API: Đặt lịch hẹn
router.post('/add', async (req, res) => {
    try {
        const { pet, ownerName, phone, email, appointmentDate, reason } = req.body;
        const newAppointment = await appointmentController.CreateAppointment(pet, ownerName, phone, email, appointmentDate, reason);
        res.json({ message: "✅ Đặt lịch thành công!", appointment: newAppointment });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ API: Cập nhật lịch hẹn
router.put('/update/:id', async (req, res) => {
    try {
        const updatedAppointment = await appointmentController.UpdateAppointment(req.params.id, req.body);
        res.json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Xóa lịch hẹn


// ✅ API: Xóa lịch hẹn (đánh dấu `isDeleted: true`)

router.delete('/delete/:id', async (req, res) => {
    try {
        await appointmentController.DeleteAppointment(req.params.id);
        res.json({ message: "Lịch hẹn đã bị xóa!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

