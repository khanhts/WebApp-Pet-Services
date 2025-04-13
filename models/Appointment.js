
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({


const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },

    pet: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },

    appointmentDate: { type: Date, required: true, index: true }, // Đặt index để tăng hiệu suất truy vấn
    reason: { type: String },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Liên kết với bác sĩ
    status: { type: String, default: "Đang xử lý" } // Trạng thái đơn
}, { timestamps: true });

    service: { type: String, required: true }, // Dịch vụ
    reason: { type: String, required: false }
});


module.exports = mongoose.model('Appointment', appointmentSchema);
