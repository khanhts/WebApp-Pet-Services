const tagModel = require("../schemas/tags");

module.exports = {
  // Create a new tag
  CreateATag: async (name, description) => {
    const newTag = new tagModel({ name, description });
    return await newTag.save();
  },

  // Get all tags
  GetAllTags: async () => {
    return await tagModel.find();
  },

  // Get a single tag by ID
  GetTagById: async (id) => {
    return await tagModel.findById(id);
  },

  // Update a tag by ID
  UpdateATag: async (id, body) => {
    return await tagModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
  },

  // Delete a tag by ID
  DeleteATag: async (id) => {
    return await tagModel.findByIdAndDelete(id);
  },
};
