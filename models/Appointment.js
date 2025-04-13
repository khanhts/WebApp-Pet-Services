
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    pet: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true }, // Dịch vụ
    reason: { type: String, required: false }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
