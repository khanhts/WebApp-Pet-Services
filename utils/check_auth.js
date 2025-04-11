const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");
const userController = require("../controllers/users");

module.exports = {
  check_authentication: async function (req, res, next) {
    try {
      if (req.headers && req.headers.authorization) {
        const authorization = req.headers.authorization;

        if (authorization.startsWith("Bearer ")) {
          const token = authorization.split(" ")[1];

          const result = jwt.verify(token, constants.SECRET_KEY);

          if (result.expire > Date.now()) {
            let user = await userController.GetUserByID(result.id);
            req.accessToken = token;
            req.user = user;
            next();
          } else {
            const error = new Error("Token expired");
            error.statusCode = 403;
            throw error;
          }
        } else {
          const error = new Error("Invalid token format");
          error.statusCode = 403;
          throw error;
        }
      } else {
        const error = new Error("Authorization header missing");
        error.statusCode = 403;
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  check_authorization: function (roles) {
    return async function (req, res, next) {
      try {
        console.log("User role:", req.user.role.name);
        let roleOfUser = req.user.role.name;
        if (roles.includes(roleOfUser)) {
          next();
        } else {
          throw new Error("ban khong co quyen");
        }
      } catch (error) {
        next(error);
      }
    };
  },
};
