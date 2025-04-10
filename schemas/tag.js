let mongoose = require("mongoose");
const tagSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
});
module.exports = mongoose.model("tag", tagSchema);
