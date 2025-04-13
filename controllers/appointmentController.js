const appointmentModel = require('../models/Appointment');

// ✅ Danh sách ngày lễ cố định (YYYY-MM-DD)
const holidays = [
    "2025-01-01", // Tết Dương lịch
    "2025-04-30", // Giải phóng miền Nam
    "2025-05-01", // Quốc tế Lao động
    "2025-09-02", // Quốc khánh
    // ➕ Thêm các ngày lễ khác ở đây nếu cần
];

module.exports = {
    // ✅ Lấy tất cả lịch hẹn (chỉ lấy lịch chưa bị xóa)
    GetAllAppointments: async function () {
        return await appointmentModel.find({ isDeleted: { $ne: true } });
    },

    // ✅ Lấy lịch hẹn theo ID
    GetAppointmentByID: async function (id) {
        return await appointmentModel.findOne({ _id: id, isDeleted: { $ne: true } });
    },

    // ✅ Lấy danh sách giờ đã đặt trong ngày
    GetBookedHoursByDate: async function (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const appointments = await appointmentModel.find({
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            isDeleted: { $ne: true }
        });

        return appointments.map(appt => appt.appointmentDate.toISOString().slice(11, 16));
    },

    // ✅ Lấy danh sách ngày đã đầy 5 lịch hẹn
    GetFullyBookedDates: async function () {
        const appointments = await appointmentModel.aggregate([
            { $match: { isDeleted: { $ne: true } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
                    count: { $sum: 1 }
                }
            },
            { $match: { count: { $gte: 5 } } }
        ]);

        return appointments.map(appt => appt._id);
    },

    // ✅ Đặt lịch hẹn mới (có kiểm tra ngày lễ + giới hạn lịch/ngày/giờ)
    CreateAppointment: async function (pet, ownerName, phone, email, appointmentDate, reason) {
        try {
            const selectedDate = new Date(appointmentDate);
            const selectedHour = selectedDate.toISOString().slice(11, 16);
            const formattedDate = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD

            // ❌ Kiểm tra ngày lễ
            if (holidays.includes(formattedDate)) {
                throw new Error("❌ Không thể đặt lịch vào ngày lễ!");
            }

            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            // ❌ Kiểm tra số lượng lịch trong ngày
            const countAppointments = await appointmentModel.countDocuments({
                appointmentDate: { $gte: startOfDay, $lte: endOfDay },
                isDeleted: { $ne: true }
            });

            if (countAppointments >= 5) {
                throw new Error("❌ Ngày này đã đủ 5 lịch hẹn, vui lòng chọn ngày khác!");
            }

            // ❌ Kiểm tra trùng khung giờ
            const existingAppointment = await appointmentModel.findOne({
                appointmentDate: selectedDate,
                isDeleted: { $ne: true }
            });

            if (existingAppointment) {
                throw new Error(`❌ Khung giờ ${selectedHour} đã được đặt, vui lòng chọn giờ khác!`);
            }

            // ✅ Lưu lịch mới
            const newAppointment = new appointmentModel({
                pet,
                ownerName,
                phone,
                email,
                appointmentDate: selectedDate,
                reason,
                isDeleted: false
            });

            return await newAppointment.save();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // ✅ Cập nhật lịch hẹn
    UpdateAppointment: async function (id, updateData) {
        try {
            return await appointmentModel.findOneAndUpdate(
                { _id: id, isDeleted: { $ne: true } },
                updateData,
                { new: true }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // ✅ Xóa lịch hẹn (đánh dấu isDeleted)
    DeleteAppointment: async function (id) {
        try {
            return await appointmentModel.findOneAndUpdate(
                { _id: id },
                { isDeleted: true },
                { new: true }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }
};
