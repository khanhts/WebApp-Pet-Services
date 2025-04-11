const appointmentModel = require("../schemas/appointments");

module.exports = {
  // Get all appointments (exclude deleted ones)
  GetAllAppointments: async function () {
    try {
      return await appointmentModel
        .find({ isDeleted: false })
        .populate("user_id"); // Exclude deleted appointments
    } catch (error) {
      throw new Error("Error fetching appointments: " + error.message);
    }
  },

  // Get appointment by ID (exclude deleted ones)
  GetAppointmentByID: async function (id) {
    try {
      const appointment = await appointmentModel
        .findOne({ _id: id, isDeleted: false }) // Exclude deleted appointments
        .populate("user_id");
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      return appointment;
    } catch (error) {
      throw new Error("Error fetching appointment: " + error.message);
    }
  },

  // Create a new appointment
  CreateAppointment: async function (appointmentData) {
    try {
      const newAppointment = new appointmentModel(appointmentData);
      return await newAppointment.save();
    } catch (error) {
      throw new Error("Error creating appointment: " + error.message);
    }
  },

  // Update an appointment
  UpdateAppointment: async function (id, updatedInfo) {
    try {
      const appointment = await appointmentModel.findByIdAndUpdate(
        id,
        updatedInfo,
        {
          new: true,
        }
      );
      if (!appointment || appointment.isDeleted) {
        throw new Error("Appointment not found");
      }
      return appointment;
    } catch (error) {
      throw new Error("Error updating appointment: " + error.message);
    }
  },

  // Soft delete an appointment
  DeleteAppointment: async function (id) {
    try {
      const appointment = await appointmentModel.findByIdAndUpdate(
        id,
        { isDeleted: true }, // Mark as deleted
        { new: true }
      );
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      return appointment;
    } catch (error) {
      throw new Error("Error deleting appointment: " + error.message);
    }
  },
};
