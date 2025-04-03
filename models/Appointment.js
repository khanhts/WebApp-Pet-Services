const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    pet: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    appointmentDate: { type: Date, required: true, index: true }, // Đặt index để tăng hiệu suất truy vấn
    reason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
