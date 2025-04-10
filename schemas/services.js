let mongoose = require("mongoose");
const serviceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  duration: { type: Number },
  dateCreated: { type: Date, default: Date.now },
});
module.exports = mongoose.model("product", productSchema);
