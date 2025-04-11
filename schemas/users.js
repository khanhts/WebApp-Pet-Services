let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let usersSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email khong duoc de trong"],
      unique: [true, "email da ton tai"],
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    loginCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "roles",
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExp: Date,
  },
  {
    timestamps: true,
  }
);
usersSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    let salt = bcrypt.genSaltSync(10);
    let encrypted = bcrypt.hashSync(this.password + "", salt);
    this.password = encrypted;
  }
  next();
});
module.exports = mongoose.model("users", usersSchema);
// products
