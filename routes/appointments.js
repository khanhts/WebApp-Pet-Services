const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

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

// ✅ API: Lấy danh sách giờ đã đặt trong ngày
router.get('/booked-hours', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: "Thiếu ngày!" });

        const bookedHours = await appointmentController.GetBookedHoursByDate(date);
        res.json(bookedHours);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách giờ đặt!", error });
    }
});

// ✅ API: Lấy danh sách ngày đã đủ 5 lịch hẹn
router.get('/disabled-dates', async (req, res) => {
    try {
        const disabledDates = await appointmentController.GetFullyBookedDates();
        res.json(disabledDates);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách ngày đã đủ lịch!", error });
    }
});

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
