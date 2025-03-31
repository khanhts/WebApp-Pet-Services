let userModel = require('../schemas/user');
let appointmentModel = require('../schemas/appointment');

module.exports = {
    GetAllAppointment: async function (req, res) {
        try {
            let appointments = await appointmentModel.find({}).populate('customer').populate('vet');
            CreateSuccessRes(res, appointments, 200);
        } catch (error) {
            CreateErrorRes(res, error.message, 500);
        }
    },
    GetAppointmentByID: async function (req, res) {
        try {
            let appointment = await appointmentModel.findById(req.params.id).populate('customer').populate('vet');
            CreateSuccessRes(res, appointment, 200);
        } catch (error) {
            CreateErrorRes(res, error.message, 500);
        }
    },
    CreateAnAppointment: async function (req, res) {
        try {
            let body = req.body;
            let appointment = new appointmentModel(body);
            await appointment.save();
            CreateSuccessRes(res, appointment, 201);
        } catch (error) {
            CreateErrorRes(res, error.message, 500);
        }
    },
    UpdateAnAppointment: async function (req, res) {
        try {
            let body = req.body;
            let appointment = await appointmentModel.findByIdAndUpdate(req.params.id, body, { new: true });
            CreateSuccessRes(res, appointment, 200);
        } catch (error) {
            CreateErrorRes(res, error.message, 500);
        }
    },
    DeleteAnAppointment: async function (req, res) {
        try {
            await appointmentModel.findByIdAndDelete(req.params.id);
            CreateSuccessRes(res, {}, 204);
        } catch (error) {
            CreateErrorRes(res, error.message, 500);
        }
    }
}