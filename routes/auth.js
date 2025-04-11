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
const { access } = require("fs");
const { error } = require("console");

router.post("/login", async function (req, res, next) {
  try {
    let body = req.body;
    let email = body.email;
    let password = body.password;

    let userID = await userController.CheckLogin(email, password);

    let accessToken = jwt.sign(
      {
        id: userID,
        expire: new Date(Date.now() + 15 * 60 * 1000).getTime(),
      },
      constants.SECRET_KEY,
      { expiresIn: "15m" }
    );

    let refreshToken = jwt.sign(
      {
        id: userID,
        expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
      },
      constants.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    CreateSuccessRes(res, { accessToken }, 200);
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
        body.fullName,
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
  try {
    if (req.user) {
      const user = await userController.GetUserByID(req.user.id);
      res.status(200).json({ user });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/forgotpassword", validate, async function (req, res, next) {
  try {
    let email = req.body.email;
    let user = await userController.GetUserByEmail(email);
    if (user) {
      user.resetPasswordToken = crypto.randomBytes(24).toString("hex");
      user.resetPasswordTokenExp = new Date(
        Date.now() + 10 * 60 * 1000
      ).getTime();
      await user.save();
      let url = `http://localhost:5173/auth/reset_password/${user.resetPasswordToken}`;
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
});

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

router.post("/logout", async function (req, res, next) {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    CreateSuccessRes(res, { message: "Logged out successfully" }, 200);
  } catch (error) {
    CreateErrorRes(res, error.message, 500);
  }
});

router.get("/refresh", async function (req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, constants.REFRESH_SECRET_KEY);
    const newAccessToken = jwt.sign({ id: decoded.id }, constants.SECRET_KEY, {
      expiresIn: "15m",
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

module.exports = router;
