var express = require("express");
var router = express.Router();
var userController = require("../controllers/users");
let { CreateSuccessRes, CreateErrorRes } = require("../utils/responseHandler");
let jwt = require("jsonwebtoken");
let constants = require("../utils/constants");
let { check_authentication } = require("../utils/check_auth");
let {
  validate,
  validatorLogin,
  validatorForgotPassword,
  validatorChangePassword,
  validatorCreateUser,
} = require("../utils/validators");
let crypto = require("crypto");
let { sendmail } = require("../utils/sendmail");

router.post("/login", async function (req, res, next) {
  try {
    let body = req.body;
    let email = body.email;
    let password = body.password;
    let userID = await userController.CheckLogin(email, password);
    let token = jwt.sign(
      {
        id: userID,
        expire: new Date(Date.now() + 60 * 60 * 1000).getTime(),
      },
      constants.SECRET_KEY
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    CreateSuccessRes(res, { message: "Login successful" }, 200);
  } catch (error) {
    CreateErrorRes(res, error.message, 401);
  }
});

router.post(
  "/signup",
  validatorCreateUser,
  validate,
  async function (req, res, next) {
    try {
      let body = req.body;
      let newUser = await userController.CreateAnUser(
        body.email,
        body.password,
        body.fullname,
        body.phone,
        body.address,
        "customer"
      );
      CreateSuccessRes(
        res,
        jwt.sign(
          {
            id: newUser._id,
            expire: new Date(Date.now() + 60 * 60 * 1000).getTime(),
          },
          process.env.SECRET_KEY
        ),
        200
      );
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/changepassword",
  check_authentication,
  async function (req, res, next) {
    try {
      let body = req.body;
      let oldpassword = body.oldpassword;
      let newpassword = body.newpassword;
      let result = await userController.ChangePassword(
        req.user,
        oldpassword,
        newpassword
      );
      CreateSuccessRes(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/me", check_authentication, async function (req, res, next) {
  console.log(req.user);
  CreateSuccessRes(res, req.user, 200);
});

router.post(
  "/forgotpassword",
  validatorForgotPassword,
  validate,
  async function (req, res, next) {
    try {
      let email = req.body.email;
      let user = await userController.GetUserByEmail(email);
      if (user) {
        user.resetPasswordToken = crypto.randomBytes(24).toString("hex");
        user.resetPasswordTokenExp = new Date(
          Date.now() + 10 * 60 * 1000
        ).getTime();
        await user.save();
        let url = `http://localhost:3000/auth/reset_password/${user.resetPasswordToken}`;
        await sendmail(user.email, "Reset password", url);
        CreateSuccessRes(
          res,
          {
            url: url,
          },
          200
        );
      } else {
        throw new Error("email khong ton tai");
      }
    } catch (error) {
      next(error);
    }
  }
);

//cai 2 thu vien: nodemailer, multer

router.post(
  "/reset_password/:token",
  validatorChangePassword,
  validate,
  async function (req, res, next) {
    try {
      let token = req.params.token;
      let user = await userController.GetUserByToken(token);
      if (user) {
        let newpassword = req.body.password;
        user.password = newpassword;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExp = null;
        await user.save();
        CreateSuccessRes(res, user, 200);
      } else {
        throw new Error("email khong ton tai");
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
