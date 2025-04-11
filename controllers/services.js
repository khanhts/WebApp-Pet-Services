const serviceModel = require("../schemas/services");

module.exports = {
  GetAllServices: async function () {
    try {
      return await serviceModel.find({ isDeleted: false });
    } catch (error) {
      throw new Error("Error fetching services: " + error.message);
    }
  },

  GetServiceById: async function (id) {
    try {
      const service = await serviceModel.findById(id);
      if (!service || service.isDeleted) {
        throw new Error("Service not found");
      }
      return service;
    } catch (error) {
      throw new Error("Error fetching service: " + error.message);
    }
  },

  CreateService: async function (serviceData) {
    try {
      const newService = new serviceModel(serviceData);
      return await newService.save();
    } catch (error) {
      throw new Error("Error creating service: " + error.message);
    }
  },

  UpdateService: async function (id, updatedData) {
    try {
      const service = await serviceModel.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!service || service.isDeleted) {
        throw new Error("Service not found");
      }
      return service;
    } catch (error) {
      throw new Error("Error updating service: " + error.message);
    }
  },

  DeleteService: async function (id) {
    try {
      const service = await serviceModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      if (!service) {
        throw new Error("Service not found");
      }
      return service;
    } catch (error) {
      throw new Error("Error deleting service: " + error.message);
    }
  },
};
