const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product", // Reference to the Product model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Ratings between 1 and 5
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("review", reviewSchema);
