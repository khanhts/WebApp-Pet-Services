const tagModel = require("../schemas/tags");

module.exports = {
  CreateATag: async (name, description) => {
    const newTag = new tagModel({ name, description });
    return await newTag.save();
  },

  GetAllTags: async () => {
    return await tagModel.find();
  },

  GetTagById: async (id) => {
    return await tagModel.findById(id);
  },

  UpdateATag: async (id, body) => {
    return await tagModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
  },

  DeleteATag: async (id) => {
    return await tagModel.findByIdAndDelete(id);
  },
};
