const express = require('express');
const router = express.Router();
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
router.get('/:id', getAppointment, (req, res) => {
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

module.exports = router;
