const appointmentModel = require("../schemas/appointments");

module.exports = {
  GetAllAppointments: async function () {
    try {
      return await appointmentModel
        .find({ isDeleted: false })
        .populate("user_id");
    } catch (error) {
      throw new Error("Error fetching appointments: " + error.message);
    }
  },

  GetAppointmentByID: async function (id) {
    try {
      const appointment = await appointmentModel
        .findOne({ _id: id, isDeleted: false })
        .populate("user_id");
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      return appointment;
    } catch (error) {
      throw new Error("Error fetching appointment: " + error.message);
    }
  },

  CreateAppointment: async function (appointmentData) {
    try {
      const newAppointment = new appointmentModel(appointmentData);
      return await newAppointment.save();
    } catch (error) {
      throw new Error("Error creating appointment: " + error.message);
    }
  },

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

  DeleteAppointment: async function (id) {
    try {
      const appointment = await appointmentModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
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
