const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  registerDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Đã đăng ký', 'Đã hủy', 'Hoàn thành'], default: 'Đã đăng ký' }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
