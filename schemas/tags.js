let mongoose = require("mongoose");
const tagSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});
module.exports = mongoose.model("tag", tagSchema);
