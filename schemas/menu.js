let mongoose = require("mongoose");
let menuSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      default: "",
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "menu",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("menu", menuSchema);
