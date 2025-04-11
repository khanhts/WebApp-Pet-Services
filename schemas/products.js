let mongoose = require("mongoose");
let slugify = require("slugify");

let productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    urlImg: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("product", productSchema);
