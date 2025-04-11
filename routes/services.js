const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/services");
let constants = require("../utils/constants");
let {
  check_authentication,
  check_authorization,
} = require("../utils/check_auth");

router.get("/", check_authentication, async (req, res) => {
  try {
    const services = await serviceController.GetAllServices();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", check_authentication, async (req, res) => {
  try {
    const service = await serviceController.GetServiceById(req.params.id);
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

router.post(
  "/",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res) => {
    try {
      const newService = await serviceController.CreateService(req.body);
      res.status(201).json({ success: true, data: newService });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

router.put(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res) => {
    try {
      const updatedService = await serviceController.UpdateService(
        req.params.id,
        req.body
      );
      res.status(200).json({ success: true, data: updatedService });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
);

router.delete(
  "/:id",
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async (req, res) => {
    try {
      const deletedService = await serviceController.DeleteService(
        req.params.id
      );
      res.status(200).json({ success: true, data: deletedService });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
