let userModel = require("../schemas/users");
let roleModel = require("../schemas/roles");
let bcrypt = require("bcrypt");

module.exports = {
  GetAllUsers: async function () {
    const adminRole = await roleModel.findOne({ name: "admin" });
    return await userModel.find({
      role: { $ne: adminRole._id },
    });
  },
  GetAllUsersByRole: async function (id) {
    return await userModel.find({
      role: id,
      status: false,
    });
  },
  GetUserByID: async function (id) {
    return await userModel.findById(id).populate({
      path: "role",
      select: "name",
    });
  },
  GetUserByEmail: async function (email) {
    return await userModel
      .findOne({
        email: email,
      })
      .populate({
        path: "role",
        select: "name",
      });
  },
  GetUserByToken: async function (token) {
    return await userModel
      .findOne({
        resetPasswordToken: token,
      })
      .populate({
        path: "role",
        select: "name",
      });
  },
  GetUserByEmail: async function (email) {
    return await userModel.findOne({
      status: false,
      email: email,
    });
  },
  CreateAnUser: async function (
    email,
    password,
    fullName,
    phone,
    address,
    rolename
  ) {
    try {
      let role = await roleModel.findOne({
        name: rolename,
      });
      if (role) {
        let user = new userModel({
          email: email,
          password: password,
          fullName: fullName,
          phone: phone,
          address: address,
          role: role._id,
        });
        return await user.save();
      } else {
        throw new Error("Error: Role not found");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  UpdateAnUser: async function (id, body) {
    try {
      let user = await userModel.findById(id);
      let allowField = [
        "password",
        "urlImg",
        "role",
        "fullName",
        "phone",
        "address",
        "status",
      ];
      for (const key of Object.keys(body)) {
        if (allowField.includes(key)) {
          if (key === "status") body[key] = body[key] === "true" ? true : false;
          user[key] = body[key];
        }
      }
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  DeleteAnUser: async function (id) {
    try {
      return await userModel.findByIdAndUpdate(id, {
        status: false,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  CheckLogin: async function (email, password) {
    let user = await this.GetUserByEmail(email);
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        return user._id;
      } else {
        throw new Error("Email hoặc mật khẩu không đúng.");
      }
    }
  },
  ChangePassword: async function (user, oldpassword, newpassword) {
    if (bcrypt.compareSync(oldpassword, user.password)) {
      user.password = newpassword;
      return await user.save();
    } else {
      throw new Error("Old password is incorrect");
    }
  },
};
