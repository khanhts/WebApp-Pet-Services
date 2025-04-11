const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments");
let constants = require("../utils/constants");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");

// Get all appointments
router.get(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res) => {
    try {
      const appointments = await appointmentController.GetAllAppointments();
      res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Get appointment by ID
router.get(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res) => {
    try {
      const appointment = await appointmentController.GetAppointmentByID(
        req.params.id
      );
      res.status(200).json({ success: true, data: appointment });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
);

// Create a new appointment
router.post("/", check_authentication, async (req, res) => {
  try {
    console.log(req.body);
    const newAppointment = await appointmentController.CreateAppointment(
      req.body
    );
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update an appointment
router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res) => {
    try {
      const updatedAppointment = await appointmentController.UpdateAppointment(
        req.params.id,
        req.body
      );
      res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

// Delete an appointment
router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res) => {
    try {
      const deletedAppointment = await appointmentController.DeleteAppointment(
        req.params.id
      );
      res.status(200).json({ success: true, data: deletedAppointment });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
